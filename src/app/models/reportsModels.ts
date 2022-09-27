export interface Report {
  type: string;
  id: number;
  currency: {
    code: string;
    name: string;
  };
  dateAccIn: string | Date;
  pkind: number;
  agent: {
    code: string;
    name: string;
  };
  pointOfSale: {
    code: string;
    name: string;
  };
  attrClose: number;
  dts: {
    code: string;
    name: string;
  };
  userId: number;
  datInp: string | Date;
  storno: number | boolean;
}

export interface ReportsResponce {
  count: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  items: Report[];
}