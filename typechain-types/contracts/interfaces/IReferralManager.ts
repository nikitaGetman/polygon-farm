/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export declare namespace IReferralManager {
  export type AddDividendsParamsStruct = {
    user: PromiseOrValue<string>;
    reward: PromiseOrValue<BigNumberish>;
    referral: PromiseOrValue<string>;
    level: PromiseOrValue<BigNumberish>;
    depositAmount: PromiseOrValue<BigNumberish>;
    stakingPlanId: PromiseOrValue<BigNumberish>;
    reason: PromiseOrValue<BigNumberish>;
  };

  export type AddDividendsParamsStructOutput = [
    string,
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    user: string;
    reward: BigNumber;
    referral: string;
    level: BigNumber;
    depositAmount: BigNumber;
    stakingPlanId: BigNumber;
    reason: BigNumber;
  };

  export type ReferralStruct = {
    referralAddress: PromiseOrValue<string>;
    level: PromiseOrValue<BigNumberish>;
    activationDate: PromiseOrValue<BigNumberish>;
    isReferralSubscriptionActive: PromiseOrValue<boolean>;
  };

  export type ReferralStructOutput = [string, BigNumber, BigNumber, boolean] & {
    referralAddress: string;
    level: BigNumber;
    activationDate: BigNumber;
    isReferralSubscriptionActive: boolean;
  };
}

export interface IReferralManagerInterface extends utils.Interface {
  functions: {
    "addUserDividends((address,uint256,address,uint256,uint256,uint256,uint256))": FunctionFragment;
    "calculateRefReward(uint256,uint256)": FunctionFragment;
    "getReferralLevels()": FunctionFragment;
    "getUserReferralsByLevel(address,uint256)": FunctionFragment;
    "getUserReferrer(address)": FunctionFragment;
    "setUserReferrer(address,address)": FunctionFragment;
    "userHasSubscription(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addUserDividends"
      | "calculateRefReward"
      | "getReferralLevels"
      | "getUserReferralsByLevel"
      | "getUserReferrer"
      | "setUserReferrer"
      | "userHasSubscription"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addUserDividends",
    values: [IReferralManager.AddDividendsParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateRefReward",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getReferralLevels",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getUserReferralsByLevel",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserReferrer",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setUserReferrer",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "userHasSubscription",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "addUserDividends",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateRefReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReferralLevels",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserReferralsByLevel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserReferrer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setUserReferrer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userHasSubscription",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IReferralManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IReferralManagerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addUserDividends(
      params: IReferralManager.AddDividendsParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    calculateRefReward(
      amount: PromiseOrValue<BigNumberish>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getReferralLevels(overrides?: CallOverrides): Promise<[BigNumber]>;

    getUserReferralsByLevel(
      userAddress: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[IReferralManager.ReferralStructOutput[]]>;

    getUserReferrer(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setUserReferrer(
      user: PromiseOrValue<string>,
      referrer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    userHasSubscription(
      user: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  addUserDividends(
    params: IReferralManager.AddDividendsParamsStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  calculateRefReward(
    amount: PromiseOrValue<BigNumberish>,
    level: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getReferralLevels(overrides?: CallOverrides): Promise<BigNumber>;

  getUserReferralsByLevel(
    userAddress: PromiseOrValue<string>,
    level: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<IReferralManager.ReferralStructOutput[]>;

  getUserReferrer(
    user: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  setUserReferrer(
    user: PromiseOrValue<string>,
    referrer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  userHasSubscription(
    user: PromiseOrValue<string>,
    level: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    addUserDividends(
      params: IReferralManager.AddDividendsParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    calculateRefReward(
      amount: PromiseOrValue<BigNumberish>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReferralLevels(overrides?: CallOverrides): Promise<BigNumber>;

    getUserReferralsByLevel(
      userAddress: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<IReferralManager.ReferralStructOutput[]>;

    getUserReferrer(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    setUserReferrer(
      user: PromiseOrValue<string>,
      referrer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    userHasSubscription(
      user: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    addUserDividends(
      params: IReferralManager.AddDividendsParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    calculateRefReward(
      amount: PromiseOrValue<BigNumberish>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReferralLevels(overrides?: CallOverrides): Promise<BigNumber>;

    getUserReferralsByLevel(
      userAddress: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserReferrer(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setUserReferrer(
      user: PromiseOrValue<string>,
      referrer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    userHasSubscription(
      user: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addUserDividends(
      params: IReferralManager.AddDividendsParamsStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    calculateRefReward(
      amount: PromiseOrValue<BigNumberish>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getReferralLevels(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getUserReferralsByLevel(
      userAddress: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserReferrer(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setUserReferrer(
      user: PromiseOrValue<string>,
      referrer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    userHasSubscription(
      user: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
