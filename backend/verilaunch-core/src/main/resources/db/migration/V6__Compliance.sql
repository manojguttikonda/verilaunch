CREATE TABLE compliance_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_key VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policy_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_key VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    result VARCHAR(50) NOT NULL,
    reason TEXT,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_policy_evals_user ON policy_evaluations(user_id);
CREATE INDEX idx_policy_evals_key ON policy_evaluations(policy_key);
