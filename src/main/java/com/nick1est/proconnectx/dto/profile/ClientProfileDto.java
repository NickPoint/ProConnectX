package com.nick1est.proconnectx.dto.profile;

import com.nick1est.proconnectx.dto.AddressDto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ClientProfileDto extends BaseProfileDto {
    @NotNull
    private AddressDto address;
}
