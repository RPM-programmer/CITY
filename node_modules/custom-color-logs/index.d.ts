// index.d.ts

/**
 * Базовый интерфейс для методов логирования компонентов
 */
export interface ComponentMethods {
  Info(info: string): string;
  Error(error: Error | { message: string }): string;
  Warn(warn: string): string;
  FunctionInfo(funName: string, info: string): string;
  FunctionStatus(function_name: string, return_info: string): string;
  FunctionPrint(funName: string, text: string): string;
}

/**
 * Специфичные методы для производительности, которые генерируются динамически
 */
export interface PerformanceMethods {
  PositivePerfomance(funName: string, text: string): string;
  NegativePerfomance(funName: string, text: string): string;
}

/**
 * Объединенный интерфейс динамических методов для стандартных компонентов
 * (Например: ServerInfo, ServerError, ServerPositivePerfomance)
 */
export interface GeneratedComponentMethods extends ComponentMethods {
  PositivePerfomance(funName: string, text: string): string;
  NegativePerfomance(funName: string, text: string): string;
}

/**
 * Главный класс/объект экспорта утилиты логирования
 */
export declare class print {
  // --- Методы для Server ---
  static ServerInfo(info: string): string;
  static ServerError(error: Error | { message: string }): string;
  static ServerWarn(warn: string): string;
  static ServerFunctionInfo(funName: string, info: string): string;
  static ServerFunctionStatus(function_name: string, return_info: string): string;
  static ServerFunctionPrint(funName: string, text: string): string;
  
  /** @deprecated Используйте правильное написание: ServerFunctionPositivePerfomance */
  static ServerFuctionPositivePerfomance(funName: string, text: string): string; 
  
  // ДОБАВЛЕНО: Новый правильный тип метода
  static ServerFunctionPositivePerfomance(funName: string, text: string): string;
  static ServerFunctionNegativePerfomance(funName: string, text: string): string;

  // ... (повторить логику добавления нового метода для Socket, Writter, Database) ...

  // --- Методы для Nodemailer ---
  static NodemailerInfo(info: string): string;
  static NodemailerError(error: Error | { message: string }): string;
  static NodemailerWarn(warn: string): string;
  static NodemailerFunctionInfo(funName: string, info: string): string;
  static NodemailerFunctionStatus(function_name: string, return_info: string): string;
  static NodemailerFunctionPrint(funName: string, text: string): string;
  
  /** @deprecated Используйте правильное написание: NodemailerFunctionPositivePerfomance */
  static NodemailerFuctionPositivePerfomance(funName: string, text: string): string;
  
  // ДОБАВЛЕНО: Новый правильный тип метода
  static NodemailerFunctionPositivePerfomance(funName: string, text: string): string;
  static NodemailerFunctionNegativePerfomance(funName: string, text: string): string;

  /** @deprecated Используйте правильное написание: NodemailerFunctionPositiveSending */
  static NodemailerFuctionPositiveSending(gmail: string): string;
  
  // ДОБАВЛЕНО: Новый правильный тип метода
  static NodemailerFunctionPositiveSending(gmail: string): string;
  static NodemailerFunctionNegativeSending(gmail: string): string;
}


export default print;
