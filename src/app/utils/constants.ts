import { ResizeOptions } from "sharp";
import { RoleCodes } from "./shared.types";

export const DATE_FORMAT = "DD.MM.YYYY, HH:mm";

export enum IMAGE_SIZE {
  LARGE,
  MEDIUM,
  SMALL,
}

export const IMAGE_RESIZE_OPTIONS: { [key in IMAGE_SIZE]?: ResizeOptions } = {
  [IMAGE_SIZE.LARGE]: {
    width: 900,
    fit: "contain",
    withoutEnlargement: true
  },
  [IMAGE_SIZE.MEDIUM]: {
    width: 720,
    fit: "contain",
    withoutEnlargement: false
  },
  [IMAGE_SIZE.SMALL]: {
    width: 360,
    fit: "contain",
    withoutEnlargement: false
  }
};

export const AMO_CRM_STATUSES = [
  { value: 35316181, text: "Неразобранное" },
  { value: 35852401, text: "Новое" },
  { value: 35839165, text: "Не дозвонились" },
  { value: 35316184, text: "Первичный контакт" },
  { value: 35316187, text: "Квалифицированный лид" },
  { value: 142, text: "Успешно реализовано" },
  { value: 143, text: "Закрыто и не реализовано" }
];

export const AMO_CRM_NO_DATA_STATUS = "Нет данных";

export const fieldIds = {
  CONSULTATION: {
    TARIFF_NAME: 334729,
    COMMENT: 355093
  },
  RESUME: {
    PROFESSION: 333519,
    POSITION: 333521,
    SALARY: 333523,
    ABOUT: 355279,
    EXPERIENCE: {
      COMPANY: 333525,
      DURATION: 333527,
      DURATION_TYPE: 333529,
      POSITION: 333531,
      DETAILS: 355149
    },
    EDUCATION: {
      EDUCATION_LEVEL: 333541,
      FACULTY: 333543,
      INSTITUTION: 333545,
      SPECIALIZATION: 333547,
      GRADUATION_YEAR: 333549
    }
  },
  REVIEWS: {
    COMMENT: 179401,
    COMMENT_2: 304195,
    RATING: 312857,
    RATING_2: 312859,
    RECOMMEND: 334717,
    RECOMMEND_OLD: 334727
  },
  LEAD: {
    FIELDS: {
      TYPE: 328273,
      NAME: 312861,
      NAME_OLD: 312863,
      CITY: 314409
    },
    TYPES: {
      RESUME: 555999,
      CALLBACK: 555995,
      CONSULTATION: 556001,
      REVIEWS: 555997
    },
    STATUSES: {
      UNPARSED: 35852401,
      DID_NOT_GET_THROUGH: 35839165,
      PRIMARY_CONTACT: 35316184,
      QUALIFIED_LEAD: 35316187,
      SUCCESSFULLY_IMPLEMENTED: 142,
      CLOSED_AND_NOT_IMPLEMENTED: 143
    }
  },
  CONTACT: {
    PHONE: 42931,
    EMAIL: 42933,
    SEX: 42933
  },
  STATISTICS: {
    UTM_SOURCE: 831073,
    UTM_MEDIUM: 831075,
    UTM_CAMPAIGN: 831077,
    UTM_TERM: 831079,
    UTM_CONTENT: 831081,
    UTM_REFERRER: 831083
  }
};

export const EXCEL_NULL_CONSTANT = "null";
export const INTERNATIONAL_PHONE_CODE = "7";
export const LOCALL_PHONE_CODE = "8";
export const EXCEL_DATA_COLS = 4;
export const SMS_CODE_LENGTH = 5;
export const CODE_EXPIRATION_MINUTES = 10;
export const SECONDS_PER_MINUTE = 60;
export const MILLISECONDS_PER_SECOND = 1000;
export const SLUG_LENGTH = 4;
export const CONSULTATION_SLUG_LENGTH = 6;
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 15;
export const YANDEX_METRIKA_ID = 65430640;
export const LOWER_ENG_ALPHABET = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

export const PASSWORD_ALPHABET = [
  ...LOWER_ENG_ALPHABET,
  ...LOWER_ENG_ALPHABET.map(letter => letter.toUpperCase()),
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "~",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "-",
  "+",
  "=",
  "{",
  "[",
  "}",
  "]",
  "|",
  ":",
  ";",
  "<",
  ",",
  ">",
  ".",
  "?",
  "/",
  `"`,
  `'`
];

export const adminEditPack = [RoleCodes.ADMIN, RoleCodes.OPERATOR];

export const adminViewPack = [
  RoleCodes.ADMIN,
  RoleCodes.ADMIN_VIEWER,
  RoleCodes.OPERATOR,
  RoleCodes.OPERATOR_VIEWER
];

export const companyViewPack = [
  RoleCodes.EMPLOYER,
  RoleCodes.EMPLOYER_VIEWER,
  RoleCodes.EMPLOYER_OPERATOR,
  RoleCodes.EMPLOYER_OPERATOR_VIEWER
];

export const companyEditPack = [
  RoleCodes.EMPLOYER,
  RoleCodes.EMPLOYER_OPERATOR
];

export const entityManagers = [
  RoleCodes.ADMIN,
  RoleCodes.OPERATOR,
  RoleCodes.EMPLOYER,
  RoleCodes.EMPLOYER_OPERATOR,
  RoleCodes.EMPLOYEE
];

export const TEN_MINUTES = 600;
export const THIRTY_SECONDS = 30;
export const TOP_APPEALS_LIMIT = 10;
export const LAST_USERS_COUNT = 10;
export const QUARTER_INTERVAL = 3;
export const STANDART_TIME_INTERVAL = 1;
export const STAT_HOUR_FORMAT = "dd TMmon yyyy HH24:MI";
export const STAT_GENERAL_FORMAT = "dd TMmon yyyy";
export const GENERAL_DATE_FORMAT = "YYYY-MM-DD";
export const MOMENT_HOUR_FORMAT = "DD MMM YYYY HH:mm";
export const MOMENT_GENERAL_FORMAT = "DD MMM YYYY";
export const HOUR_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const NULL_COUNT = 0;
export const HUNDRED_PERCENT = 100;