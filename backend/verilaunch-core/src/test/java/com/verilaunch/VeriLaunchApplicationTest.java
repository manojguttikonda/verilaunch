package com.verilaunch;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class VeriLaunchApplicationTest {

    @Test
    void contextLoads() {
        // Verifies the entire Spring context loads successfully with all beans wired
    }
}
