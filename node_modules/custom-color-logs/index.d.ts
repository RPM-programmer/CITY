export interface ComponentMethods {
  Info(info: string): string;
  Error(error: Error | { message: string }): string;
  Warn(warn: string): string;
  FunctionInfo(funName: string, info: string): string;
  FunctionStatus(function_name: string, return_info: string): string;
  FunctionPrint(funName: string, text: string): string;
  FunctionPositivePerformance(funName: string, text: string): string;
  FunctionNegativePerformance(funName: string, text: string): string;
}

export declare class print {
  // --- Server ---
  static ServerInfo(info: string): string;
  static ServerError(error: Error | { message: string }): string;
  static ServerWarn(warn: string): string;
  static ServerFunctionInfo(funName: string, info: string): string;
  static ServerFunctionStatus(function_name: string, return_info: string): string;
  static ServerFunctionPrint(funName: string, text: string): string;
  static ServerFunctionPositivePerformance(funName: string, text: string): string;
  static ServerFunctionNegativePerformance(funName: string, text: string): string;

  // --- Socket ---
  static SocketInfo(info: string): string;
  static SocketError(error: Error | { message: string }): string;
  static SocketWarn(warn: string): string;
  static SocketFunctionInfo(funName: string, info: string): string;
  static SocketFunctionStatus(function_name: string, return_info: string): string;
  static SocketFunctionPrint(funName: string, text: string): string;
  static SocketFunctionPositivePerformance(funName: string, text: string): string;
  static SocketFunctionNegativePerformance(funName: string, text: string): string;

  // --- Writter ---
  static WritterInfo(info: string): string;
  static WritterError(error: Error | { message: string }): string;
  static WritterWarn(warn: string): string;
  static WritterFunctionInfo(funName: string, info: string): string;
  static WritterFunctionStatus(function_name: string, return_info: string): string;
  static WritterFunctionPrint(funName: string, text: string): string;
  static WritterFunctionPositivePerformance(funName: string, text: string): string;
  static WritterFunctionNegativePerformance(funName: string, text: string): string;

  // --- Database ---
  static DatabaseInfo(info: string): string;
  static DatabaseError(error: Error | { message: string }): string;
  static DatabaseWarn(warn: string): string;
  static DatabaseFunctionInfo(funName: string, info: string): string;
  static DatabaseFunctionStatus(function_name: string, return_info: string): string;
  static DatabaseFunctionPrint(funName: string, text: string): string;
  static DatabaseFunctionPositivePerformance(funName: string, text: string): string;
  static DatabaseFunctionNegativePerformance(funName: string, text: string): string;

  // --- Nodemailer ---
  static NodemailerInfo(info: string): string;
  static NodemailerError(error: Error | { message: string }): string;
  static NodemailerWarn(warn: string): string;
  static NodemailerFunctionInfo(funName: string, info: string): string;
  static NodemailerFunctionStatus(function_name: string, return_info: string): string;
  static NodemailerFunctionPrint(funName: string, text: string): string;
  static NodemailerFunctionPositivePerformance(funName: string, text: string): string;
  static NodemailerFunctionNegativePerformance(funName: string, text: string): string;
  static NodemailerFunctionPositiveSending(gmail: string): string;
  static NodemailerFunctionNegativeSending(gmail: string): string;
}

export default print;
