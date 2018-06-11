import * as Cmd from '../cmd'
import { ActionCmdResult, Init, InitObj, normalizeInit } from '../index'

export type Dt<T extends string, D = null> = {
  tag: T,
  data: D
} & { __tsTag: 'DateType' }

/**
 * ADT Helper for TS
 * e.g.
 * ```ts
 * type Msg =
 * | Dt<'fetchBook', number>
 * | Dt<'updateBook', Book>
 *
 * let msg = dt('fetchBook', 1)
 * switch(msg.tag) {
 *   case 'fetchBook':
 *      //...
 *      break
 *   case 'updateBook':
 *      //...
 *      break
 *   default:
 *      never(msg.tag) // incomplete check from TS
 *      break
 * }
 * ```
 */
export function dt<T extends string, D = null>(tag: T, data: D = null as any) {
  return { tag, data } as Dt<T, D>
}

export const never = (f: never) => f

export const mkInit = <S, A>(state: S, cmd: Cmd.CmdType<A> = Cmd.none): () => ActionCmdResult<S, A> => () => [state, cmd]

export type Fn1<T1, R> = (a1: T1) => R

export function compose<T1, T2, R>(
  fn1: Fn1<T1, T2>,
  fn2: Fn1<T2, R>,
): Fn1<T1, R>
export function compose<T1, T2, T3, R>(
  fn1: Fn1<T1, T2>,
  fn2: Fn1<T2, T3>,
  fn3: Fn1<T3, R>,
): Fn1<T1, R>
export function compose<T1, T2, T3, T4, R>(
  fn1: Fn1<T1, T2>,
  fn2: Fn1<T2, T3>,
  fn3: Fn1<T3, T4>,
  fn4: Fn1<T4, R>,
): Fn1<T1, R>
export function compose<T1, T2, T3, T4, T5, R>(
  fn1: Fn1<T1, T2>,
  fn2: Fn1<T2, T3>,
  fn3: Fn1<T3, T4>,
  fn4: Fn1<T4, T5>,
  fn5: Fn1<T5, R>,
): Fn1<T1, R>
export function compose<T1, T2, T3, T4, T5, T6, R>(
  fn1: Fn1<T1, T2>,
  fn2: Fn1<T2, T3>,
  fn3: Fn1<T3, T4>,
  fn4: Fn1<T4, T5>,
  fn5: Fn1<T5, T6>,
  fn6: Fn1<T6, R>,
): Fn1<T1, R>
export function compose<T1, T2, T3, T4, T5, T6, T7, R>(
  fn1: Fn1<T1, T2>,
  fn2: Fn1<T2, T3>,
  fn3: Fn1<T3, T4>,
  fn4: Fn1<T4, T5>,
  fn5: Fn1<T5, T6>,
  fn6: Fn1<T6, T7>,
  fn7: Fn1<T7, R>,
): Fn1<T1, R>
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, R>(
  fn1: Fn1<T1, T2>,
  fn2: Fn1<T2, T3>,
  fn3: Fn1<T3, T4>,
  fn4: Fn1<T4, T5>,
  fn5: Fn1<T5, T6>,
  fn6: Fn1<T6, T7>,
  fn7: Fn1<T7, T8>,
  fn8: Fn1<T8, R>,
): Fn1<T1, R>
export function compose<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(
  fn1: Fn1<T1, T2>,
  fn2: Fn1<T2, T3>,
  fn3: Fn1<T3, T4>,
  fn4: Fn1<T4, T5>,
  fn5: Fn1<T5, T6>,
  fn6: Fn1<T6, T7>,
  fn7: Fn1<T7, T8>,
  fn8: Fn1<T8, T9>,
  fn9: Fn1<T9, R>,
): Fn1<T1, R>
export function compose<R>(...fns: Function[]): Fn1<any, R> {
  return arg =>
    fns.reduce(
      (arg, fn) => fn(arg),
      arg,
    )
}

export function combineInit<T extends { [k: string]: InitObj<any, any> }, A extends { [k: string]: any }>(arg: T) {
  let state = {} as { [k in keyof T]: T[k]['state'] }
  let cmd = Cmd.none as Cmd.CmdType<A>
  for (const key in arg) {
    let init = normalizeInit<any, any>(arg[key])
    state[key] = init.state
    cmd = Cmd.batch(cmd, Cmd.map(_ => _[key], init.cmd))
  }
  return { state, cmd }
}