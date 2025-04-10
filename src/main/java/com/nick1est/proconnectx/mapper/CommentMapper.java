package com.nick1est.proconnectx.mapper;

import com.nick1est.proconnectx.dao.Comment;
import com.nick1est.proconnectx.dto.CommentDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    public CommentDto toDto(Comment comment);
}
