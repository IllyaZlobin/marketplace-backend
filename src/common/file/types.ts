export enum FileType {
  IMAGE = 'image',
  EXCEL = 'excel'
}

export enum ImageMime {
  JPG = 'image/jpg',
  JPEG = 'image/jpeg',
  PNG = 'image/png'
}

export enum DocumentMime {
  PDF = 'application/pdf',
  HTML = 'text/html'
}

export enum ExcelMime {
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  CSV = 'text/csv'
}

export const FILE_MIME = {
  ...ImageMime,
  ...DocumentMime,
  ...ExcelMime
};

export type FileMime = ImageMime | DocumentMime | ExcelMime;
