import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";

const SHEET_ID = "1PnfvcnBeWxWnxLQmIVKDljKDZkLZRs2Yfi_i0Jm7t18";
const EMAIL = "service-account-1@golden-argon-377004.iam.gserviceaccount.com";
const PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCngH0QwynwEqUu\nui+wQTrV5L3pW73pOC2EawHn0qwK77ulRcQDrghEujtW1m8QQzkD63phNluy+Ty4\nwMuAf3g1bK3Gvj5EmYMsUMEJo61Fy1n4pnyMCRpmMau+z6P8irCr4Ascv+O8hUpo\n4yAyfEKPmTjIdbKpacmkxTua5KN2+I+eEFwYfZtMl3snWk69WKGHXCZgW/c98Ya4\nbujU0ttthIvrWqv4utd7ssSC+JlyNW+H47o+lBMA9XtkFVCTMcDxrMWeHUQ7aPc2\n7h8Nqblb9pk6BmKQzWe8xsSlQfCZEpQlqr2waqrj9qwoyGOaPzBDyjCVMR1jHkrL\nx6vf7kzLAgMBAAECggEAT+gvga4hFRrH+3Ut598Octi3MpqmDBrVOA0WcSHjGiqI\nsY0JOBovbp4LTd9pR3BSREjzbmnQsB5PdfHfgzMMRSxN8Hh0WySC28LAfFk9gYTD\nrKe71dBH7EW44YPL/t+o7a2pj3MJcTeDKmtjwkHePQQC/zqK22AQpo7C4x88zjV6\nsLF6MYagJVA0DBwPgrVfg6u3lt/z1H2z713xU+KbzfwnA7KRx0n0ylUM86RiaWmi\ngvD8U02/MariLkzVBy7cD8PYrahW1mksSCYTMV6yLbY+YNAM+qRlLDMF5hgDsiN0\nb3N7Z/Xkt0HXzuTwtRxJ8swP+WCYMWvWOni14Cs5HQKBgQDeuTJ4Ku6n5mR9FGl5\n8BycqwDCB7+wlOEjmdPmAWhO10AktDcv138U6JyPFc5lgZENtrvv2NRRyVnMByez\nzVi267RrEfIbWWK3SUOruFkgQ5hJYxYPiOm7m/fyZomP9TYFLAkR/OF5XfVO4kS9\n+F0i06ueRPmpLzr+yRXHDPK9BQKBgQDAhyjcyKKb91LxqHoUtVm1I9zXWUHJWk0r\nNsthmPUClRBa2jjp4aus/PQLkiPYJMzyctwx6QrKnBr64qdWrGyjPWrTQP0NTp3C\nLfb/zFbk9J2B9pUomy4CrkYaIeHQy/U7qCfPnHNvmuvuY45GQocA2RA7Va12MTn5\n2ghlLvGLjwKBgBfnlK0lHnxS1BJAsJlv1gJSsEAjCMXxFMD3b7DOEd30aGQIG6w8\n2tzponQRCRgH8gOgy0cQ5KjqjYLCedZogc8QOUsMoAmjbF7ztBmoLZiy6JNn2SRN\ns5h5QwF3U+hpjyS69zZBCAo4tW2EB5DEKWrlgRP5nzozYYebGYVFtH/pAoGAcmlf\nzSSmDY2Civ2V3uyObOjs+kSepau2JDIh1tPw9iHjYDpCjCqBvQFtfdrQ1ke4S3Qa\nisZ0lUcDeYhr7UP2I2QCMZxzRQ8tDRIHsKecE9+SIoOIzGK7ivhJzInKCizKhTM+\nxU+yAebMwhQDnpk2ZTiZPsmBlbVXQLVjO84T2N0CgYEAgm4rqljAZsIvWhL+eRN9\nstJBD9lLxRtLsoaWGmJIx4dbRs+vQCT1YlK2pySMyYD2Jfe5MzjSUGA4W+b/dYxp\nslwh7welDd+Tn5UgtxqqQrYgGJNCzBghRnITrxyOZc66n+qxJPKHit3zKmCLfAfp\nGo0KiCxZpGXlEZmidqUFB9A=\n-----END PRIVATE KEY-----\n";

export class GoogleSpreadSheetService {
  private static instance: GoogleSpreadSheetService;
  private doc: GoogleSpreadsheet;

  private constructor() {
    this.doc = new GoogleSpreadsheet(SHEET_ID);
  }

  static async getInstance() {
    if (this.instance) {
      return this.instance;
    }

    const instance = new GoogleSpreadSheetService();

    await instance.doc.useServiceAccountAuth({
      client_email: EMAIL,
      private_key: PRIVATE_KEY,
    });

    await instance.doc.loadInfo();

    return instance;
  }

  getSheet(title: string) {
    const sheet = this.doc.sheetsByTitle[title];
    if (!sheet) {
      return;
    }
    return sheet;
  }
}
