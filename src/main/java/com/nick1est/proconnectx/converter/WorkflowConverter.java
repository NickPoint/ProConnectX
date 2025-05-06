package com.nick1est.proconnectx.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nick1est.proconnectx.dto.WorkflowStep;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

@Converter(autoApply = false)
public class WorkflowConverter implements AttributeConverter<List<WorkflowStep>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<WorkflowStep> attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize workflow", e);
        }
    }

    @Override
    public List<WorkflowStep> convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, objectMapper.getTypeFactory()
                                                              .constructCollectionType(List.class, WorkflowStep.class));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to deserialize workflow", e);
        }
    }
}
