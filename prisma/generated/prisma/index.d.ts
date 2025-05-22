
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tournament
 * 
 */
export type Tournament = $Result.DefaultSelection<Prisma.$TournamentPayload>
/**
 * Model Clip
 * 
 */
export type Clip = $Result.DefaultSelection<Prisma.$ClipPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tournaments
 * const tournaments = await prisma.tournament.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tournaments
   * const tournaments = await prisma.tournament.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tournament`: Exposes CRUD operations for the **Tournament** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tournaments
    * const tournaments = await prisma.tournament.findMany()
    * ```
    */
  get tournament(): Prisma.TournamentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clip`: Exposes CRUD operations for the **Clip** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clips
    * const clips = await prisma.clip.findMany()
    * ```
    */
  get clip(): Prisma.ClipDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tournament: 'Tournament',
    Clip: 'Clip'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tournament" | "clip"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tournament: {
        payload: Prisma.$TournamentPayload<ExtArgs>
        fields: Prisma.TournamentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TournamentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TournamentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          findFirst: {
            args: Prisma.TournamentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TournamentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          findMany: {
            args: Prisma.TournamentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>[]
          }
          create: {
            args: Prisma.TournamentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          createMany: {
            args: Prisma.TournamentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TournamentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>[]
          }
          delete: {
            args: Prisma.TournamentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          update: {
            args: Prisma.TournamentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          deleteMany: {
            args: Prisma.TournamentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TournamentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TournamentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>[]
          }
          upsert: {
            args: Prisma.TournamentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          aggregate: {
            args: Prisma.TournamentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTournament>
          }
          groupBy: {
            args: Prisma.TournamentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TournamentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TournamentCountArgs<ExtArgs>
            result: $Utils.Optional<TournamentCountAggregateOutputType> | number
          }
        }
      }
      Clip: {
        payload: Prisma.$ClipPayload<ExtArgs>
        fields: Prisma.ClipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          findFirst: {
            args: Prisma.ClipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          findMany: {
            args: Prisma.ClipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>[]
          }
          create: {
            args: Prisma.ClipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          createMany: {
            args: Prisma.ClipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>[]
          }
          delete: {
            args: Prisma.ClipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          update: {
            args: Prisma.ClipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          deleteMany: {
            args: Prisma.ClipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>[]
          }
          upsert: {
            args: Prisma.ClipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClipPayload>
          }
          aggregate: {
            args: Prisma.ClipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClip>
          }
          groupBy: {
            args: Prisma.ClipGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClipGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClipCountArgs<ExtArgs>
            result: $Utils.Optional<ClipCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    tournament?: TournamentOmit
    clip?: ClipOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TournamentCountOutputType
   */

  export type TournamentCountOutputType = {
    clips: number
  }

  export type TournamentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clips?: boolean | TournamentCountOutputTypeCountClipsArgs
  }

  // Custom InputTypes
  /**
   * TournamentCountOutputType without action
   */
  export type TournamentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentCountOutputType
     */
    select?: TournamentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TournamentCountOutputType without action
   */
  export type TournamentCountOutputTypeCountClipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClipWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tournament
   */

  export type AggregateTournament = {
    _count: TournamentCountAggregateOutputType | null
    _min: TournamentMinAggregateOutputType | null
    _max: TournamentMaxAggregateOutputType | null
  }

  export type TournamentMinAggregateOutputType = {
    id: string | null
    title: string | null
    createdAt: Date | null
    started: boolean | null
  }

  export type TournamentMaxAggregateOutputType = {
    id: string | null
    title: string | null
    createdAt: Date | null
    started: boolean | null
  }

  export type TournamentCountAggregateOutputType = {
    id: number
    title: number
    createdAt: number
    started: number
    _all: number
  }


  export type TournamentMinAggregateInputType = {
    id?: true
    title?: true
    createdAt?: true
    started?: true
  }

  export type TournamentMaxAggregateInputType = {
    id?: true
    title?: true
    createdAt?: true
    started?: true
  }

  export type TournamentCountAggregateInputType = {
    id?: true
    title?: true
    createdAt?: true
    started?: true
    _all?: true
  }

  export type TournamentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tournament to aggregate.
     */
    where?: TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tournaments to fetch.
     */
    orderBy?: TournamentOrderByWithRelationInput | TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tournaments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tournaments
    **/
    _count?: true | TournamentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TournamentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TournamentMaxAggregateInputType
  }

  export type GetTournamentAggregateType<T extends TournamentAggregateArgs> = {
        [P in keyof T & keyof AggregateTournament]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTournament[P]>
      : GetScalarType<T[P], AggregateTournament[P]>
  }




  export type TournamentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TournamentWhereInput
    orderBy?: TournamentOrderByWithAggregationInput | TournamentOrderByWithAggregationInput[]
    by: TournamentScalarFieldEnum[] | TournamentScalarFieldEnum
    having?: TournamentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TournamentCountAggregateInputType | true
    _min?: TournamentMinAggregateInputType
    _max?: TournamentMaxAggregateInputType
  }

  export type TournamentGroupByOutputType = {
    id: string
    title: string
    createdAt: Date
    started: boolean
    _count: TournamentCountAggregateOutputType | null
    _min: TournamentMinAggregateOutputType | null
    _max: TournamentMaxAggregateOutputType | null
  }

  type GetTournamentGroupByPayload<T extends TournamentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TournamentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TournamentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TournamentGroupByOutputType[P]>
            : GetScalarType<T[P], TournamentGroupByOutputType[P]>
        }
      >
    >


  export type TournamentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    createdAt?: boolean
    started?: boolean
    clips?: boolean | Tournament$clipsArgs<ExtArgs>
    _count?: boolean | TournamentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tournament"]>

  export type TournamentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    createdAt?: boolean
    started?: boolean
  }, ExtArgs["result"]["tournament"]>

  export type TournamentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    createdAt?: boolean
    started?: boolean
  }, ExtArgs["result"]["tournament"]>

  export type TournamentSelectScalar = {
    id?: boolean
    title?: boolean
    createdAt?: boolean
    started?: boolean
  }

  export type TournamentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "createdAt" | "started", ExtArgs["result"]["tournament"]>
  export type TournamentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clips?: boolean | Tournament$clipsArgs<ExtArgs>
    _count?: boolean | TournamentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TournamentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TournamentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TournamentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tournament"
    objects: {
      clips: Prisma.$ClipPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      createdAt: Date
      started: boolean
    }, ExtArgs["result"]["tournament"]>
    composites: {}
  }

  type TournamentGetPayload<S extends boolean | null | undefined | TournamentDefaultArgs> = $Result.GetResult<Prisma.$TournamentPayload, S>

  type TournamentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TournamentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TournamentCountAggregateInputType | true
    }

  export interface TournamentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tournament'], meta: { name: 'Tournament' } }
    /**
     * Find zero or one Tournament that matches the filter.
     * @param {TournamentFindUniqueArgs} args - Arguments to find a Tournament
     * @example
     * // Get one Tournament
     * const tournament = await prisma.tournament.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TournamentFindUniqueArgs>(args: SelectSubset<T, TournamentFindUniqueArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tournament that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TournamentFindUniqueOrThrowArgs} args - Arguments to find a Tournament
     * @example
     * // Get one Tournament
     * const tournament = await prisma.tournament.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TournamentFindUniqueOrThrowArgs>(args: SelectSubset<T, TournamentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tournament that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentFindFirstArgs} args - Arguments to find a Tournament
     * @example
     * // Get one Tournament
     * const tournament = await prisma.tournament.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TournamentFindFirstArgs>(args?: SelectSubset<T, TournamentFindFirstArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tournament that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentFindFirstOrThrowArgs} args - Arguments to find a Tournament
     * @example
     * // Get one Tournament
     * const tournament = await prisma.tournament.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TournamentFindFirstOrThrowArgs>(args?: SelectSubset<T, TournamentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tournaments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tournaments
     * const tournaments = await prisma.tournament.findMany()
     * 
     * // Get first 10 Tournaments
     * const tournaments = await prisma.tournament.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tournamentWithIdOnly = await prisma.tournament.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TournamentFindManyArgs>(args?: SelectSubset<T, TournamentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tournament.
     * @param {TournamentCreateArgs} args - Arguments to create a Tournament.
     * @example
     * // Create one Tournament
     * const Tournament = await prisma.tournament.create({
     *   data: {
     *     // ... data to create a Tournament
     *   }
     * })
     * 
     */
    create<T extends TournamentCreateArgs>(args: SelectSubset<T, TournamentCreateArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tournaments.
     * @param {TournamentCreateManyArgs} args - Arguments to create many Tournaments.
     * @example
     * // Create many Tournaments
     * const tournament = await prisma.tournament.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TournamentCreateManyArgs>(args?: SelectSubset<T, TournamentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tournaments and returns the data saved in the database.
     * @param {TournamentCreateManyAndReturnArgs} args - Arguments to create many Tournaments.
     * @example
     * // Create many Tournaments
     * const tournament = await prisma.tournament.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tournaments and only return the `id`
     * const tournamentWithIdOnly = await prisma.tournament.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TournamentCreateManyAndReturnArgs>(args?: SelectSubset<T, TournamentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tournament.
     * @param {TournamentDeleteArgs} args - Arguments to delete one Tournament.
     * @example
     * // Delete one Tournament
     * const Tournament = await prisma.tournament.delete({
     *   where: {
     *     // ... filter to delete one Tournament
     *   }
     * })
     * 
     */
    delete<T extends TournamentDeleteArgs>(args: SelectSubset<T, TournamentDeleteArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tournament.
     * @param {TournamentUpdateArgs} args - Arguments to update one Tournament.
     * @example
     * // Update one Tournament
     * const tournament = await prisma.tournament.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TournamentUpdateArgs>(args: SelectSubset<T, TournamentUpdateArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tournaments.
     * @param {TournamentDeleteManyArgs} args - Arguments to filter Tournaments to delete.
     * @example
     * // Delete a few Tournaments
     * const { count } = await prisma.tournament.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TournamentDeleteManyArgs>(args?: SelectSubset<T, TournamentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tournaments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tournaments
     * const tournament = await prisma.tournament.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TournamentUpdateManyArgs>(args: SelectSubset<T, TournamentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tournaments and returns the data updated in the database.
     * @param {TournamentUpdateManyAndReturnArgs} args - Arguments to update many Tournaments.
     * @example
     * // Update many Tournaments
     * const tournament = await prisma.tournament.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tournaments and only return the `id`
     * const tournamentWithIdOnly = await prisma.tournament.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TournamentUpdateManyAndReturnArgs>(args: SelectSubset<T, TournamentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tournament.
     * @param {TournamentUpsertArgs} args - Arguments to update or create a Tournament.
     * @example
     * // Update or create a Tournament
     * const tournament = await prisma.tournament.upsert({
     *   create: {
     *     // ... data to create a Tournament
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tournament we want to update
     *   }
     * })
     */
    upsert<T extends TournamentUpsertArgs>(args: SelectSubset<T, TournamentUpsertArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tournaments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentCountArgs} args - Arguments to filter Tournaments to count.
     * @example
     * // Count the number of Tournaments
     * const count = await prisma.tournament.count({
     *   where: {
     *     // ... the filter for the Tournaments we want to count
     *   }
     * })
    **/
    count<T extends TournamentCountArgs>(
      args?: Subset<T, TournamentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TournamentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tournament.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TournamentAggregateArgs>(args: Subset<T, TournamentAggregateArgs>): Prisma.PrismaPromise<GetTournamentAggregateType<T>>

    /**
     * Group by Tournament.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TournamentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TournamentGroupByArgs['orderBy'] }
        : { orderBy?: TournamentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TournamentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTournamentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tournament model
   */
  readonly fields: TournamentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tournament.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TournamentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clips<T extends Tournament$clipsArgs<ExtArgs> = {}>(args?: Subset<T, Tournament$clipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tournament model
   */
  interface TournamentFieldRefs {
    readonly id: FieldRef<"Tournament", 'String'>
    readonly title: FieldRef<"Tournament", 'String'>
    readonly createdAt: FieldRef<"Tournament", 'DateTime'>
    readonly started: FieldRef<"Tournament", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Tournament findUnique
   */
  export type TournamentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Tournament to fetch.
     */
    where: TournamentWhereUniqueInput
  }

  /**
   * Tournament findUniqueOrThrow
   */
  export type TournamentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Tournament to fetch.
     */
    where: TournamentWhereUniqueInput
  }

  /**
   * Tournament findFirst
   */
  export type TournamentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Tournament to fetch.
     */
    where?: TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tournaments to fetch.
     */
    orderBy?: TournamentOrderByWithRelationInput | TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tournaments.
     */
    cursor?: TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tournaments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tournaments.
     */
    distinct?: TournamentScalarFieldEnum | TournamentScalarFieldEnum[]
  }

  /**
   * Tournament findFirstOrThrow
   */
  export type TournamentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Tournament to fetch.
     */
    where?: TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tournaments to fetch.
     */
    orderBy?: TournamentOrderByWithRelationInput | TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tournaments.
     */
    cursor?: TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tournaments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tournaments.
     */
    distinct?: TournamentScalarFieldEnum | TournamentScalarFieldEnum[]
  }

  /**
   * Tournament findMany
   */
  export type TournamentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Tournaments to fetch.
     */
    where?: TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tournaments to fetch.
     */
    orderBy?: TournamentOrderByWithRelationInput | TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tournaments.
     */
    cursor?: TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tournaments.
     */
    skip?: number
    distinct?: TournamentScalarFieldEnum | TournamentScalarFieldEnum[]
  }

  /**
   * Tournament create
   */
  export type TournamentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * The data needed to create a Tournament.
     */
    data: XOR<TournamentCreateInput, TournamentUncheckedCreateInput>
  }

  /**
   * Tournament createMany
   */
  export type TournamentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tournaments.
     */
    data: TournamentCreateManyInput | TournamentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tournament createManyAndReturn
   */
  export type TournamentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * The data used to create many Tournaments.
     */
    data: TournamentCreateManyInput | TournamentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tournament update
   */
  export type TournamentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * The data needed to update a Tournament.
     */
    data: XOR<TournamentUpdateInput, TournamentUncheckedUpdateInput>
    /**
     * Choose, which Tournament to update.
     */
    where: TournamentWhereUniqueInput
  }

  /**
   * Tournament updateMany
   */
  export type TournamentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tournaments.
     */
    data: XOR<TournamentUpdateManyMutationInput, TournamentUncheckedUpdateManyInput>
    /**
     * Filter which Tournaments to update
     */
    where?: TournamentWhereInput
    /**
     * Limit how many Tournaments to update.
     */
    limit?: number
  }

  /**
   * Tournament updateManyAndReturn
   */
  export type TournamentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * The data used to update Tournaments.
     */
    data: XOR<TournamentUpdateManyMutationInput, TournamentUncheckedUpdateManyInput>
    /**
     * Filter which Tournaments to update
     */
    where?: TournamentWhereInput
    /**
     * Limit how many Tournaments to update.
     */
    limit?: number
  }

  /**
   * Tournament upsert
   */
  export type TournamentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * The filter to search for the Tournament to update in case it exists.
     */
    where: TournamentWhereUniqueInput
    /**
     * In case the Tournament found by the `where` argument doesn't exist, create a new Tournament with this data.
     */
    create: XOR<TournamentCreateInput, TournamentUncheckedCreateInput>
    /**
     * In case the Tournament was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TournamentUpdateInput, TournamentUncheckedUpdateInput>
  }

  /**
   * Tournament delete
   */
  export type TournamentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter which Tournament to delete.
     */
    where: TournamentWhereUniqueInput
  }

  /**
   * Tournament deleteMany
   */
  export type TournamentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tournaments to delete
     */
    where?: TournamentWhereInput
    /**
     * Limit how many Tournaments to delete.
     */
    limit?: number
  }

  /**
   * Tournament.clips
   */
  export type Tournament$clipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    where?: ClipWhereInput
    orderBy?: ClipOrderByWithRelationInput | ClipOrderByWithRelationInput[]
    cursor?: ClipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClipScalarFieldEnum | ClipScalarFieldEnum[]
  }

  /**
   * Tournament without action
   */
  export type TournamentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
  }


  /**
   * Model Clip
   */

  export type AggregateClip = {
    _count: ClipCountAggregateOutputType | null
    _min: ClipMinAggregateOutputType | null
    _max: ClipMaxAggregateOutputType | null
  }

  export type ClipMinAggregateOutputType = {
    id: string | null
    label: string | null
    url: string | null
    createdAt: Date | null
    tournamentId: string | null
  }

  export type ClipMaxAggregateOutputType = {
    id: string | null
    label: string | null
    url: string | null
    createdAt: Date | null
    tournamentId: string | null
  }

  export type ClipCountAggregateOutputType = {
    id: number
    label: number
    url: number
    createdAt: number
    tournamentId: number
    _all: number
  }


  export type ClipMinAggregateInputType = {
    id?: true
    label?: true
    url?: true
    createdAt?: true
    tournamentId?: true
  }

  export type ClipMaxAggregateInputType = {
    id?: true
    label?: true
    url?: true
    createdAt?: true
    tournamentId?: true
  }

  export type ClipCountAggregateInputType = {
    id?: true
    label?: true
    url?: true
    createdAt?: true
    tournamentId?: true
    _all?: true
  }

  export type ClipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clip to aggregate.
     */
    where?: ClipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: ClipOrderByWithRelationInput | ClipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clips
    **/
    _count?: true | ClipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClipMaxAggregateInputType
  }

  export type GetClipAggregateType<T extends ClipAggregateArgs> = {
        [P in keyof T & keyof AggregateClip]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClip[P]>
      : GetScalarType<T[P], AggregateClip[P]>
  }




  export type ClipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClipWhereInput
    orderBy?: ClipOrderByWithAggregationInput | ClipOrderByWithAggregationInput[]
    by: ClipScalarFieldEnum[] | ClipScalarFieldEnum
    having?: ClipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClipCountAggregateInputType | true
    _min?: ClipMinAggregateInputType
    _max?: ClipMaxAggregateInputType
  }

  export type ClipGroupByOutputType = {
    id: string
    label: string
    url: string
    createdAt: Date
    tournamentId: string
    _count: ClipCountAggregateOutputType | null
    _min: ClipMinAggregateOutputType | null
    _max: ClipMaxAggregateOutputType | null
  }

  type GetClipGroupByPayload<T extends ClipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClipGroupByOutputType[P]>
            : GetScalarType<T[P], ClipGroupByOutputType[P]>
        }
      >
    >


  export type ClipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    url?: boolean
    createdAt?: boolean
    tournamentId?: boolean
    tournament?: boolean | TournamentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clip"]>

  export type ClipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    url?: boolean
    createdAt?: boolean
    tournamentId?: boolean
    tournament?: boolean | TournamentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clip"]>

  export type ClipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    url?: boolean
    createdAt?: boolean
    tournamentId?: boolean
    tournament?: boolean | TournamentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clip"]>

  export type ClipSelectScalar = {
    id?: boolean
    label?: boolean
    url?: boolean
    createdAt?: boolean
    tournamentId?: boolean
  }

  export type ClipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "label" | "url" | "createdAt" | "tournamentId", ExtArgs["result"]["clip"]>
  export type ClipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tournament?: boolean | TournamentDefaultArgs<ExtArgs>
  }
  export type ClipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tournament?: boolean | TournamentDefaultArgs<ExtArgs>
  }
  export type ClipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tournament?: boolean | TournamentDefaultArgs<ExtArgs>
  }

  export type $ClipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Clip"
    objects: {
      tournament: Prisma.$TournamentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      label: string
      url: string
      createdAt: Date
      tournamentId: string
    }, ExtArgs["result"]["clip"]>
    composites: {}
  }

  type ClipGetPayload<S extends boolean | null | undefined | ClipDefaultArgs> = $Result.GetResult<Prisma.$ClipPayload, S>

  type ClipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClipCountAggregateInputType | true
    }

  export interface ClipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Clip'], meta: { name: 'Clip' } }
    /**
     * Find zero or one Clip that matches the filter.
     * @param {ClipFindUniqueArgs} args - Arguments to find a Clip
     * @example
     * // Get one Clip
     * const clip = await prisma.clip.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClipFindUniqueArgs>(args: SelectSubset<T, ClipFindUniqueArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Clip that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClipFindUniqueOrThrowArgs} args - Arguments to find a Clip
     * @example
     * // Get one Clip
     * const clip = await prisma.clip.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClipFindUniqueOrThrowArgs>(args: SelectSubset<T, ClipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Clip that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipFindFirstArgs} args - Arguments to find a Clip
     * @example
     * // Get one Clip
     * const clip = await prisma.clip.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClipFindFirstArgs>(args?: SelectSubset<T, ClipFindFirstArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Clip that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipFindFirstOrThrowArgs} args - Arguments to find a Clip
     * @example
     * // Get one Clip
     * const clip = await prisma.clip.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClipFindFirstOrThrowArgs>(args?: SelectSubset<T, ClipFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clips that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clips
     * const clips = await prisma.clip.findMany()
     * 
     * // Get first 10 Clips
     * const clips = await prisma.clip.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clipWithIdOnly = await prisma.clip.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClipFindManyArgs>(args?: SelectSubset<T, ClipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Clip.
     * @param {ClipCreateArgs} args - Arguments to create a Clip.
     * @example
     * // Create one Clip
     * const Clip = await prisma.clip.create({
     *   data: {
     *     // ... data to create a Clip
     *   }
     * })
     * 
     */
    create<T extends ClipCreateArgs>(args: SelectSubset<T, ClipCreateArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clips.
     * @param {ClipCreateManyArgs} args - Arguments to create many Clips.
     * @example
     * // Create many Clips
     * const clip = await prisma.clip.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClipCreateManyArgs>(args?: SelectSubset<T, ClipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clips and returns the data saved in the database.
     * @param {ClipCreateManyAndReturnArgs} args - Arguments to create many Clips.
     * @example
     * // Create many Clips
     * const clip = await prisma.clip.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clips and only return the `id`
     * const clipWithIdOnly = await prisma.clip.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClipCreateManyAndReturnArgs>(args?: SelectSubset<T, ClipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Clip.
     * @param {ClipDeleteArgs} args - Arguments to delete one Clip.
     * @example
     * // Delete one Clip
     * const Clip = await prisma.clip.delete({
     *   where: {
     *     // ... filter to delete one Clip
     *   }
     * })
     * 
     */
    delete<T extends ClipDeleteArgs>(args: SelectSubset<T, ClipDeleteArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Clip.
     * @param {ClipUpdateArgs} args - Arguments to update one Clip.
     * @example
     * // Update one Clip
     * const clip = await prisma.clip.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClipUpdateArgs>(args: SelectSubset<T, ClipUpdateArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clips.
     * @param {ClipDeleteManyArgs} args - Arguments to filter Clips to delete.
     * @example
     * // Delete a few Clips
     * const { count } = await prisma.clip.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClipDeleteManyArgs>(args?: SelectSubset<T, ClipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clips
     * const clip = await prisma.clip.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClipUpdateManyArgs>(args: SelectSubset<T, ClipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clips and returns the data updated in the database.
     * @param {ClipUpdateManyAndReturnArgs} args - Arguments to update many Clips.
     * @example
     * // Update many Clips
     * const clip = await prisma.clip.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clips and only return the `id`
     * const clipWithIdOnly = await prisma.clip.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClipUpdateManyAndReturnArgs>(args: SelectSubset<T, ClipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Clip.
     * @param {ClipUpsertArgs} args - Arguments to update or create a Clip.
     * @example
     * // Update or create a Clip
     * const clip = await prisma.clip.upsert({
     *   create: {
     *     // ... data to create a Clip
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Clip we want to update
     *   }
     * })
     */
    upsert<T extends ClipUpsertArgs>(args: SelectSubset<T, ClipUpsertArgs<ExtArgs>>): Prisma__ClipClient<$Result.GetResult<Prisma.$ClipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clips.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipCountArgs} args - Arguments to filter Clips to count.
     * @example
     * // Count the number of Clips
     * const count = await prisma.clip.count({
     *   where: {
     *     // ... the filter for the Clips we want to count
     *   }
     * })
    **/
    count<T extends ClipCountArgs>(
      args?: Subset<T, ClipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Clip.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClipAggregateArgs>(args: Subset<T, ClipAggregateArgs>): Prisma.PrismaPromise<GetClipAggregateType<T>>

    /**
     * Group by Clip.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClipGroupByArgs['orderBy'] }
        : { orderBy?: ClipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Clip model
   */
  readonly fields: ClipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Clip.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tournament<T extends TournamentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TournamentDefaultArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Clip model
   */
  interface ClipFieldRefs {
    readonly id: FieldRef<"Clip", 'String'>
    readonly label: FieldRef<"Clip", 'String'>
    readonly url: FieldRef<"Clip", 'String'>
    readonly createdAt: FieldRef<"Clip", 'DateTime'>
    readonly tournamentId: FieldRef<"Clip", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Clip findUnique
   */
  export type ClipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter, which Clip to fetch.
     */
    where: ClipWhereUniqueInput
  }

  /**
   * Clip findUniqueOrThrow
   */
  export type ClipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter, which Clip to fetch.
     */
    where: ClipWhereUniqueInput
  }

  /**
   * Clip findFirst
   */
  export type ClipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter, which Clip to fetch.
     */
    where?: ClipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: ClipOrderByWithRelationInput | ClipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clips.
     */
    cursor?: ClipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clips.
     */
    distinct?: ClipScalarFieldEnum | ClipScalarFieldEnum[]
  }

  /**
   * Clip findFirstOrThrow
   */
  export type ClipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter, which Clip to fetch.
     */
    where?: ClipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: ClipOrderByWithRelationInput | ClipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clips.
     */
    cursor?: ClipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clips.
     */
    distinct?: ClipScalarFieldEnum | ClipScalarFieldEnum[]
  }

  /**
   * Clip findMany
   */
  export type ClipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter, which Clips to fetch.
     */
    where?: ClipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clips to fetch.
     */
    orderBy?: ClipOrderByWithRelationInput | ClipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clips.
     */
    cursor?: ClipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clips from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clips.
     */
    skip?: number
    distinct?: ClipScalarFieldEnum | ClipScalarFieldEnum[]
  }

  /**
   * Clip create
   */
  export type ClipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * The data needed to create a Clip.
     */
    data: XOR<ClipCreateInput, ClipUncheckedCreateInput>
  }

  /**
   * Clip createMany
   */
  export type ClipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clips.
     */
    data: ClipCreateManyInput | ClipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Clip createManyAndReturn
   */
  export type ClipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * The data used to create many Clips.
     */
    data: ClipCreateManyInput | ClipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Clip update
   */
  export type ClipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * The data needed to update a Clip.
     */
    data: XOR<ClipUpdateInput, ClipUncheckedUpdateInput>
    /**
     * Choose, which Clip to update.
     */
    where: ClipWhereUniqueInput
  }

  /**
   * Clip updateMany
   */
  export type ClipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clips.
     */
    data: XOR<ClipUpdateManyMutationInput, ClipUncheckedUpdateManyInput>
    /**
     * Filter which Clips to update
     */
    where?: ClipWhereInput
    /**
     * Limit how many Clips to update.
     */
    limit?: number
  }

  /**
   * Clip updateManyAndReturn
   */
  export type ClipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * The data used to update Clips.
     */
    data: XOR<ClipUpdateManyMutationInput, ClipUncheckedUpdateManyInput>
    /**
     * Filter which Clips to update
     */
    where?: ClipWhereInput
    /**
     * Limit how many Clips to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Clip upsert
   */
  export type ClipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * The filter to search for the Clip to update in case it exists.
     */
    where: ClipWhereUniqueInput
    /**
     * In case the Clip found by the `where` argument doesn't exist, create a new Clip with this data.
     */
    create: XOR<ClipCreateInput, ClipUncheckedCreateInput>
    /**
     * In case the Clip was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClipUpdateInput, ClipUncheckedUpdateInput>
  }

  /**
   * Clip delete
   */
  export type ClipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
    /**
     * Filter which Clip to delete.
     */
    where: ClipWhereUniqueInput
  }

  /**
   * Clip deleteMany
   */
  export type ClipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clips to delete
     */
    where?: ClipWhereInput
    /**
     * Limit how many Clips to delete.
     */
    limit?: number
  }

  /**
   * Clip without action
   */
  export type ClipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Clip
     */
    select?: ClipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Clip
     */
    omit?: ClipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClipInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TournamentScalarFieldEnum: {
    id: 'id',
    title: 'title',
    createdAt: 'createdAt',
    started: 'started'
  };

  export type TournamentScalarFieldEnum = (typeof TournamentScalarFieldEnum)[keyof typeof TournamentScalarFieldEnum]


  export const ClipScalarFieldEnum: {
    id: 'id',
    label: 'label',
    url: 'url',
    createdAt: 'createdAt',
    tournamentId: 'tournamentId'
  };

  export type ClipScalarFieldEnum = (typeof ClipScalarFieldEnum)[keyof typeof ClipScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type TournamentWhereInput = {
    AND?: TournamentWhereInput | TournamentWhereInput[]
    OR?: TournamentWhereInput[]
    NOT?: TournamentWhereInput | TournamentWhereInput[]
    id?: StringFilter<"Tournament"> | string
    title?: StringFilter<"Tournament"> | string
    createdAt?: DateTimeFilter<"Tournament"> | Date | string
    started?: BoolFilter<"Tournament"> | boolean
    clips?: ClipListRelationFilter
  }

  export type TournamentOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    started?: SortOrder
    clips?: ClipOrderByRelationAggregateInput
  }

  export type TournamentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TournamentWhereInput | TournamentWhereInput[]
    OR?: TournamentWhereInput[]
    NOT?: TournamentWhereInput | TournamentWhereInput[]
    title?: StringFilter<"Tournament"> | string
    createdAt?: DateTimeFilter<"Tournament"> | Date | string
    started?: BoolFilter<"Tournament"> | boolean
    clips?: ClipListRelationFilter
  }, "id">

  export type TournamentOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    started?: SortOrder
    _count?: TournamentCountOrderByAggregateInput
    _max?: TournamentMaxOrderByAggregateInput
    _min?: TournamentMinOrderByAggregateInput
  }

  export type TournamentScalarWhereWithAggregatesInput = {
    AND?: TournamentScalarWhereWithAggregatesInput | TournamentScalarWhereWithAggregatesInput[]
    OR?: TournamentScalarWhereWithAggregatesInput[]
    NOT?: TournamentScalarWhereWithAggregatesInput | TournamentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tournament"> | string
    title?: StringWithAggregatesFilter<"Tournament"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Tournament"> | Date | string
    started?: BoolWithAggregatesFilter<"Tournament"> | boolean
  }

  export type ClipWhereInput = {
    AND?: ClipWhereInput | ClipWhereInput[]
    OR?: ClipWhereInput[]
    NOT?: ClipWhereInput | ClipWhereInput[]
    id?: StringFilter<"Clip"> | string
    label?: StringFilter<"Clip"> | string
    url?: StringFilter<"Clip"> | string
    createdAt?: DateTimeFilter<"Clip"> | Date | string
    tournamentId?: StringFilter<"Clip"> | string
    tournament?: XOR<TournamentScalarRelationFilter, TournamentWhereInput>
  }

  export type ClipOrderByWithRelationInput = {
    id?: SortOrder
    label?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    tournamentId?: SortOrder
    tournament?: TournamentOrderByWithRelationInput
  }

  export type ClipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClipWhereInput | ClipWhereInput[]
    OR?: ClipWhereInput[]
    NOT?: ClipWhereInput | ClipWhereInput[]
    label?: StringFilter<"Clip"> | string
    url?: StringFilter<"Clip"> | string
    createdAt?: DateTimeFilter<"Clip"> | Date | string
    tournamentId?: StringFilter<"Clip"> | string
    tournament?: XOR<TournamentScalarRelationFilter, TournamentWhereInput>
  }, "id">

  export type ClipOrderByWithAggregationInput = {
    id?: SortOrder
    label?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    tournamentId?: SortOrder
    _count?: ClipCountOrderByAggregateInput
    _max?: ClipMaxOrderByAggregateInput
    _min?: ClipMinOrderByAggregateInput
  }

  export type ClipScalarWhereWithAggregatesInput = {
    AND?: ClipScalarWhereWithAggregatesInput | ClipScalarWhereWithAggregatesInput[]
    OR?: ClipScalarWhereWithAggregatesInput[]
    NOT?: ClipScalarWhereWithAggregatesInput | ClipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Clip"> | string
    label?: StringWithAggregatesFilter<"Clip"> | string
    url?: StringWithAggregatesFilter<"Clip"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Clip"> | Date | string
    tournamentId?: StringWithAggregatesFilter<"Clip"> | string
  }

  export type TournamentCreateInput = {
    id?: string
    title: string
    createdAt?: Date | string
    started?: boolean
    clips?: ClipCreateNestedManyWithoutTournamentInput
  }

  export type TournamentUncheckedCreateInput = {
    id?: string
    title: string
    createdAt?: Date | string
    started?: boolean
    clips?: ClipUncheckedCreateNestedManyWithoutTournamentInput
  }

  export type TournamentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    started?: BoolFieldUpdateOperationsInput | boolean
    clips?: ClipUpdateManyWithoutTournamentNestedInput
  }

  export type TournamentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    started?: BoolFieldUpdateOperationsInput | boolean
    clips?: ClipUncheckedUpdateManyWithoutTournamentNestedInput
  }

  export type TournamentCreateManyInput = {
    id?: string
    title: string
    createdAt?: Date | string
    started?: boolean
  }

  export type TournamentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    started?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TournamentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    started?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ClipCreateInput = {
    id?: string
    label: string
    url: string
    createdAt?: Date | string
    tournament: TournamentCreateNestedOneWithoutClipsInput
  }

  export type ClipUncheckedCreateInput = {
    id?: string
    label: string
    url: string
    createdAt?: Date | string
    tournamentId: string
  }

  export type ClipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tournament?: TournamentUpdateOneRequiredWithoutClipsNestedInput
  }

  export type ClipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tournamentId?: StringFieldUpdateOperationsInput | string
  }

  export type ClipCreateManyInput = {
    id?: string
    label: string
    url: string
    createdAt?: Date | string
    tournamentId: string
  }

  export type ClipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tournamentId?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ClipListRelationFilter = {
    every?: ClipWhereInput
    some?: ClipWhereInput
    none?: ClipWhereInput
  }

  export type ClipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TournamentCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    started?: SortOrder
  }

  export type TournamentMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    started?: SortOrder
  }

  export type TournamentMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    started?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TournamentScalarRelationFilter = {
    is?: TournamentWhereInput
    isNot?: TournamentWhereInput
  }

  export type ClipCountOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    tournamentId?: SortOrder
  }

  export type ClipMaxOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    tournamentId?: SortOrder
  }

  export type ClipMinOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    tournamentId?: SortOrder
  }

  export type ClipCreateNestedManyWithoutTournamentInput = {
    create?: XOR<ClipCreateWithoutTournamentInput, ClipUncheckedCreateWithoutTournamentInput> | ClipCreateWithoutTournamentInput[] | ClipUncheckedCreateWithoutTournamentInput[]
    connectOrCreate?: ClipCreateOrConnectWithoutTournamentInput | ClipCreateOrConnectWithoutTournamentInput[]
    createMany?: ClipCreateManyTournamentInputEnvelope
    connect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
  }

  export type ClipUncheckedCreateNestedManyWithoutTournamentInput = {
    create?: XOR<ClipCreateWithoutTournamentInput, ClipUncheckedCreateWithoutTournamentInput> | ClipCreateWithoutTournamentInput[] | ClipUncheckedCreateWithoutTournamentInput[]
    connectOrCreate?: ClipCreateOrConnectWithoutTournamentInput | ClipCreateOrConnectWithoutTournamentInput[]
    createMany?: ClipCreateManyTournamentInputEnvelope
    connect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ClipUpdateManyWithoutTournamentNestedInput = {
    create?: XOR<ClipCreateWithoutTournamentInput, ClipUncheckedCreateWithoutTournamentInput> | ClipCreateWithoutTournamentInput[] | ClipUncheckedCreateWithoutTournamentInput[]
    connectOrCreate?: ClipCreateOrConnectWithoutTournamentInput | ClipCreateOrConnectWithoutTournamentInput[]
    upsert?: ClipUpsertWithWhereUniqueWithoutTournamentInput | ClipUpsertWithWhereUniqueWithoutTournamentInput[]
    createMany?: ClipCreateManyTournamentInputEnvelope
    set?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    disconnect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    delete?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    connect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    update?: ClipUpdateWithWhereUniqueWithoutTournamentInput | ClipUpdateWithWhereUniqueWithoutTournamentInput[]
    updateMany?: ClipUpdateManyWithWhereWithoutTournamentInput | ClipUpdateManyWithWhereWithoutTournamentInput[]
    deleteMany?: ClipScalarWhereInput | ClipScalarWhereInput[]
  }

  export type ClipUncheckedUpdateManyWithoutTournamentNestedInput = {
    create?: XOR<ClipCreateWithoutTournamentInput, ClipUncheckedCreateWithoutTournamentInput> | ClipCreateWithoutTournamentInput[] | ClipUncheckedCreateWithoutTournamentInput[]
    connectOrCreate?: ClipCreateOrConnectWithoutTournamentInput | ClipCreateOrConnectWithoutTournamentInput[]
    upsert?: ClipUpsertWithWhereUniqueWithoutTournamentInput | ClipUpsertWithWhereUniqueWithoutTournamentInput[]
    createMany?: ClipCreateManyTournamentInputEnvelope
    set?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    disconnect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    delete?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    connect?: ClipWhereUniqueInput | ClipWhereUniqueInput[]
    update?: ClipUpdateWithWhereUniqueWithoutTournamentInput | ClipUpdateWithWhereUniqueWithoutTournamentInput[]
    updateMany?: ClipUpdateManyWithWhereWithoutTournamentInput | ClipUpdateManyWithWhereWithoutTournamentInput[]
    deleteMany?: ClipScalarWhereInput | ClipScalarWhereInput[]
  }

  export type TournamentCreateNestedOneWithoutClipsInput = {
    create?: XOR<TournamentCreateWithoutClipsInput, TournamentUncheckedCreateWithoutClipsInput>
    connectOrCreate?: TournamentCreateOrConnectWithoutClipsInput
    connect?: TournamentWhereUniqueInput
  }

  export type TournamentUpdateOneRequiredWithoutClipsNestedInput = {
    create?: XOR<TournamentCreateWithoutClipsInput, TournamentUncheckedCreateWithoutClipsInput>
    connectOrCreate?: TournamentCreateOrConnectWithoutClipsInput
    upsert?: TournamentUpsertWithoutClipsInput
    connect?: TournamentWhereUniqueInput
    update?: XOR<XOR<TournamentUpdateToOneWithWhereWithoutClipsInput, TournamentUpdateWithoutClipsInput>, TournamentUncheckedUpdateWithoutClipsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ClipCreateWithoutTournamentInput = {
    id?: string
    label: string
    url: string
    createdAt?: Date | string
  }

  export type ClipUncheckedCreateWithoutTournamentInput = {
    id?: string
    label: string
    url: string
    createdAt?: Date | string
  }

  export type ClipCreateOrConnectWithoutTournamentInput = {
    where: ClipWhereUniqueInput
    create: XOR<ClipCreateWithoutTournamentInput, ClipUncheckedCreateWithoutTournamentInput>
  }

  export type ClipCreateManyTournamentInputEnvelope = {
    data: ClipCreateManyTournamentInput | ClipCreateManyTournamentInput[]
    skipDuplicates?: boolean
  }

  export type ClipUpsertWithWhereUniqueWithoutTournamentInput = {
    where: ClipWhereUniqueInput
    update: XOR<ClipUpdateWithoutTournamentInput, ClipUncheckedUpdateWithoutTournamentInput>
    create: XOR<ClipCreateWithoutTournamentInput, ClipUncheckedCreateWithoutTournamentInput>
  }

  export type ClipUpdateWithWhereUniqueWithoutTournamentInput = {
    where: ClipWhereUniqueInput
    data: XOR<ClipUpdateWithoutTournamentInput, ClipUncheckedUpdateWithoutTournamentInput>
  }

  export type ClipUpdateManyWithWhereWithoutTournamentInput = {
    where: ClipScalarWhereInput
    data: XOR<ClipUpdateManyMutationInput, ClipUncheckedUpdateManyWithoutTournamentInput>
  }

  export type ClipScalarWhereInput = {
    AND?: ClipScalarWhereInput | ClipScalarWhereInput[]
    OR?: ClipScalarWhereInput[]
    NOT?: ClipScalarWhereInput | ClipScalarWhereInput[]
    id?: StringFilter<"Clip"> | string
    label?: StringFilter<"Clip"> | string
    url?: StringFilter<"Clip"> | string
    createdAt?: DateTimeFilter<"Clip"> | Date | string
    tournamentId?: StringFilter<"Clip"> | string
  }

  export type TournamentCreateWithoutClipsInput = {
    id?: string
    title: string
    createdAt?: Date | string
    started?: boolean
  }

  export type TournamentUncheckedCreateWithoutClipsInput = {
    id?: string
    title: string
    createdAt?: Date | string
    started?: boolean
  }

  export type TournamentCreateOrConnectWithoutClipsInput = {
    where: TournamentWhereUniqueInput
    create: XOR<TournamentCreateWithoutClipsInput, TournamentUncheckedCreateWithoutClipsInput>
  }

  export type TournamentUpsertWithoutClipsInput = {
    update: XOR<TournamentUpdateWithoutClipsInput, TournamentUncheckedUpdateWithoutClipsInput>
    create: XOR<TournamentCreateWithoutClipsInput, TournamentUncheckedCreateWithoutClipsInput>
    where?: TournamentWhereInput
  }

  export type TournamentUpdateToOneWithWhereWithoutClipsInput = {
    where?: TournamentWhereInput
    data: XOR<TournamentUpdateWithoutClipsInput, TournamentUncheckedUpdateWithoutClipsInput>
  }

  export type TournamentUpdateWithoutClipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    started?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TournamentUncheckedUpdateWithoutClipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    started?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ClipCreateManyTournamentInput = {
    id?: string
    label: string
    url: string
    createdAt?: Date | string
  }

  export type ClipUpdateWithoutTournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipUncheckedUpdateWithoutTournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClipUncheckedUpdateManyWithoutTournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}