package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.dao.Offer;
import com.nick1est.proconnectx.dto.OfferFilter;
import com.nick1est.proconnectx.service.OfferService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/offer")
@Slf4j
public class OfferController {

    private final OfferService offerService;

    @Autowired
    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_FREELANCER') or hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public Offer createOffer(@RequestBody Offer offer) {
        return offerService.createOffer(offer);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Offer> getFilteredOffers(
            @RequestBody OfferFilter offerFilter) {
        return offerService.findFilteredOffers(offerFilter);
    }
}
