package com.nick1est.proconnectx.service;

import com.nick1est.proconnectx.dao.Field;
import com.nick1est.proconnectx.dao.Offer;
import com.nick1est.proconnectx.repository.OfferRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Range;
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

    public List<Offer> findFilteredOffers(Field field, String location, Double rating, Range<Double> price) {
        log.info("Finding offers by field: {}, location: {}, rating: {}, price: {}", field, location, rating, price);
        return offerRepository
                .findByFieldAndLocationAndRatingAndPrice(
                        field,
                        location,
                        rating,
                        price != null ? price.getLowerBound().getValue().orElse(null) : null,
                        price != null ? price.getUpperBound().getValue().orElse(null) : null);
    }
}
