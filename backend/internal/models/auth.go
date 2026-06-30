package models

type LoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Login       string `json:"login"`
	Password    string `json:"password"`
	DisplayName string `json:"displayName"`
}

type AuthResponse struct {
	AccessToken string `json:"accessToken"`
	User        User   `json:"user"`
}

type TokenResponse struct {
	AccessToken string `json:"accessToken"`
}
