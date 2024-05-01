package com.nick1est.proconnectx.dao;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ECategory {

    WEB_DESIGN("Web Design"),
    WEB_DEVELOPMENT("Web Development"),
    MOBILE_DEVELOPMENT("Mobile Development"),
    GRAPHIC_DESIGN("Graphic Design"),
    VIDEO_EDITING("Video Editing"),
    WRITING("Writing"),
    TRANSLATION("Translation"),
    MARKETING("Marketing"),
    SALES("Sales"),
    CUSTOMER_SERVICE("Customer Service"),
    ADMIN_SUPPORT("Admin Support"),
    DATA_SCIENCE("Data Science"),
    ENGINEERING("Engineering"),
    ACCOUNTING("Accounting"),
    LEGAL("Legal"),
    OTHER("Other");

    private final String name;
}
