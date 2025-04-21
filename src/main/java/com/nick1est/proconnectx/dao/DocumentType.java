package com.nick1est.proconnectx.dao;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(enumAsRef = true)
public enum DocumentType {
    ID_CARD,
    PASSPORT,
    DRIVING_LICENSE,
    BUSINESS_LICENSE,
    COMPANY_REGISTRATION,
    BANK_STATEMENT,
    OTHER,
    GALLERY,
    AVATAR
}
