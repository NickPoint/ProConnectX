package com.nick1est.proconnectx.converter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.domain.Range;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class StringToRangeConverter implements Converter<String, Range<Double>> {

    @Override
    public Range<Double> convert(String source) {
        log.debug("Converting string to range: {}", source);
        String[] split = source.split("-");
        if (split.length != 2) {
            throw new IllegalArgumentException("Range must be in format: 'lower-upper'");
        }
        return Range.closed(Double.parseDouble(split[0]), Double.parseDouble(split[1]));
    }

}
