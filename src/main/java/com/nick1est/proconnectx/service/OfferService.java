package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Offer;
import com.nick1est.proconnectx.dto.OfferFilter;
import com.nick1est.proconnectx.repository.OfferRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class OfferService {
    private final OfferRepository offerRepository;

    @Autowired
    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    public Offer createOffer(Offer offer) {
        log.info("Creating offer: {}", offer);
        return offerRepository.save(offer);
    }

    public List<Offer> findFilteredOffers(OfferFilter offerFilter) {
        log.info("Finding filtered offers: {}", offerFilter);
        return offerRepository.findByFieldAndLocationAndRatingAndPrice(
                offerFilter.getCategories(),
                offerFilter.getLocation(),
                offerFilter.getRating(),
                offerFilter.getPrice() != null
                        ? offerFilter.getPrice().getLowerBound().getValue().orElse(null)
                        : null,
                offerFilter.getPrice() != null
                        ? offerFilter.getPrice().getUpperBound().getValue().orElse(null)
                        : null);
    }
}
