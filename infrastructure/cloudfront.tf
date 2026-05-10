resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2"
  comment             = "VeriLaunch Frontend CDN - ${var.environment}"
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  origin {
    domain_name = aws_s3_bucket.frontend_assets.bucket_regional_domain_name
    origin_id   = "verilaunch-frontend-s3"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.frontend.cloudfront_access_identity_path
    }
  }

  # API proxy origin → ALB
  origin {
    domain_name = aws_lb.verilaunch.dns_name
    origin_id   = "verilaunch-api-alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # /api/* → forward to ALB backend
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "verilaunch-api-alb"

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Content-Type", "Origin"]
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
    compress    = true

    viewer_protocol_policy = "redirect-to-https"
  }

  # Default → serve frontend S3 assets
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "verilaunch-frontend-s3"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # SPA fallback — return index.html for 404s
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.acm_certificate_arn == "" ? true : false
    acm_certificate_arn            = var.acm_certificate_arn != "" ? var.acm_certificate_arn : null
    ssl_support_method             = var.acm_certificate_arn != "" ? "sni-only" : null
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}

resource "aws_cloudfront_origin_access_identity" "frontend" {
  comment = "VeriLaunch frontend OAI"
}

# S3 bucket for frontend static assets
resource "aws_s3_bucket" "frontend_assets" {
  bucket = "verilaunch-frontend-${var.environment}-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_public_access_block" "frontend_assets" {
  bucket                  = aws_s3_bucket.frontend_assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "frontend_assets_cf" {
  bucket = aws_s3_bucket.frontend_assets.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { AWS = aws_cloudfront_origin_access_identity.frontend.iam_arn }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.frontend_assets.arn}/*"
    }]
  })
}

output "cloudfront_url" {
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
  description = "CloudFront distribution URL for VeriLaunch frontend"
}
