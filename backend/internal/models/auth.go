package models

type LoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type TokenResponse struct {
	AccessToken string `json:"accessToken"`
}
