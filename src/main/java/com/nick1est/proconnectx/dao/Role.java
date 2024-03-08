package com.nick1est.proconnectx.dao;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class Role {

    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @NonNull
    private ERole name;


}
