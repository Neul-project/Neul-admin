export interface DataType {
  key: number;
  num: number;
  name: string;
  title: string;
  type: string;
  recorded: string;
  original?: any;
}

export interface DataTableType {
  key: number;
  num: number;
  name: string;
  title: string;
  type: string;
  recorded: string;
  original?: any;
}

//유저 데이터 타입
export interface UserType {
  value: number;
  label: string;
}
