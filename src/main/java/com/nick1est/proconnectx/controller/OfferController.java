package com.nick1est.proconnectx.controller;

import com.nick1est.proconnectx.dao.Field;
import com.nick1est.proconnectx.dao.Offer;
import com.nick1est.proconnectx.service.OfferService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Range;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/offer")
@Slf4j
public class OfferController {

    private final OfferService offerService;

    @Autowired
    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping
    public ResponseEntity<Offer> createOffer(@RequestBody Offer offer) {
        return ResponseEntity.ok(offerService.createOffer(offer));
    }

    @GetMapping
    public ResponseEntity<List<Offer>> getFilteredFreelancers(
            @RequestParam(required = false) Field field,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) Range<Double> price
    ) {
        return ResponseEntity.ok(offerService.findFilteredOffers(
                field,
                location,
                rating,
                price));
    }
}
