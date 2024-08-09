import Joi from "joi";

// /books/ (POST)
export interface BookCreateDTO {
  title: string;
  author: string;
  publicationDate: Date | string;
  genres: string[];
}

export interface BookCreateResponse extends BookCreateDTO {
  id: string;
}

export const BookCreateSchema = Joi.object<BookCreateDTO>({
  title: Joi.string().required(),
  author: Joi.string().required(),
  publicationDate: Joi.date().required(),
  genres: Joi.array(),
});

// /books/ (GET)
export type BooksGetResponse = BookCreateResponse[];

// /books/:id (GET)
export interface BookGetResponse extends BookCreateResponse {}

// /books/:id (PUT)
export interface BookUpdateDTO extends BookCreateDTO {}

export interface BookUpdateResponse extends BookCreateResponse {}

export const BookUpdateSchema = BookCreateSchema.keys();
