package com.lezzetly.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.lezzetly.backend.dto.auth.AuthResponse;
import com.lezzetly.backend.dto.auth.AuthUserResponse;
import com.lezzetly.backend.dto.auth.TokenPairResponse;
import com.lezzetly.backend.service.AuthService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerMvcTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private AuthService authService;

	@Test
	void postCustomerRegister_returnsCreated() throws Exception {
		when(authService.registerCustomer(any())).thenReturn(
				new AuthResponse(
						"Kayıt başarılı",
						new AuthUserResponse(5L, "A", "B", "test@example.com", "CUSTOMER"),
						new TokenPairResponse("access", "refresh", 900, 1209600)
				));

		mockMvc.perform(
						post("/api/auth/customer/register")
								.contentType(MediaType.APPLICATION_JSON)
								.content(
										"{\"firstName\":\"A\",\"lastName\":\"B\",\"email\":\"test@example.com\",\"password\":\"secret12\"}"))
				.andExpect(status().isCreated());
	}
}
