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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export declare namespace Helper {
  export type ReferralFullInfoStruct = {
    referralAddress: PromiseOrValue<string>;
    level: PromiseOrValue<BigNumberish>;
    activationDate: PromiseOrValue<BigNumberish>;
    token1Balance: PromiseOrValue<BigNumberish>;
    token2Balance: PromiseOrValue<BigNumberish>;
    isReferralSubscriptionActive: PromiseOrValue<boolean>;
    isStakingSubscriptionActive: PromiseOrValue<boolean>;
  };

  export type ReferralFullInfoStructOutput = [
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    boolean,
    boolean
  ] & {
    referralAddress: string;
    level: BigNumber;
    activationDate: BigNumber;
    token1Balance: BigNumber;
    token2Balance: BigNumber;
    isReferralSubscriptionActive: boolean;
    isStakingSubscriptionActive: boolean;
  };

  export type UserSquadInfoStruct = {
    squadStatus: ISquads.SquadStruct;
    plan: ISquads.SquadPlanStruct;
    members: PromiseOrValue<string>[];
    userHasSufficientStaking: PromiseOrValue<boolean>;
  };

  export type UserSquadInfoStructOutput = [
    ISquads.SquadStructOutput,
    ISquads.SquadPlanStructOutput,
    string[],
    boolean
  ] & {
    squadStatus: ISquads.SquadStructOutput;
    plan: ISquads.SquadPlanStructOutput;
    members: string[];
    userHasSufficientStaking: boolean;
  };
}

export declare namespace ISquads {
  export type SquadStruct = {
    subscription: PromiseOrValue<BigNumberish>;
    squadsFilled: PromiseOrValue<BigNumberish>;
  };

  export type SquadStructOutput = [BigNumber, BigNumber] & {
    subscription: BigNumber;
    squadsFilled: BigNumber;
  };

  export type SquadPlanStruct = {
    subscriptionCost: PromiseOrValue<BigNumberish>;
    reward: PromiseOrValue<BigNumberish>;
    stakingThreshold: PromiseOrValue<BigNumberish>;
    squadSize: PromiseOrValue<BigNumberish>;
    stakingPlanId: PromiseOrValue<BigNumberish>;
    isActive: PromiseOrValue<boolean>;
  };

  export type SquadPlanStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    boolean
  ] & {
    subscriptionCost: BigNumber;
    reward: BigNumber;
    stakingThreshold: BigNumber;
    squadSize: BigNumber;
    stakingPlanId: BigNumber;
    isActive: boolean;
  };
}

export interface HelperInterface extends utils.Interface {
  functions: {
    "getUserReferralsFullInfoByLevel(address,uint256)": FunctionFragment;
    "getUserSquadInfo(uint256,address)": FunctionFragment;
    "getUserSquadsInfo(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "referralManager()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "squads()": FunctionFragment;
    "staking()": FunctionFragment;
    "token1()": FunctionFragment;
    "token2()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateReferralManager(address)": FunctionFragment;
    "updateSquads(address)": FunctionFragment;
    "updateStaking(address)": FunctionFragment;
    "updateToken1(address)": FunctionFragment;
    "updateToken2(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getUserReferralsFullInfoByLevel"
      | "getUserSquadInfo"
      | "getUserSquadsInfo"
      | "owner"
      | "referralManager"
      | "renounceOwnership"
      | "squads"
      | "staking"
      | "token1"
      | "token2"
      | "transferOwnership"
      | "updateReferralManager"
      | "updateSquads"
      | "updateStaking"
      | "updateToken1"
      | "updateToken2"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getUserReferralsFullInfoByLevel",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserSquadInfo",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserSquadsInfo",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "referralManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "squads", values?: undefined): string;
  encodeFunctionData(functionFragment: "staking", values?: undefined): string;
  encodeFunctionData(functionFragment: "token1", values?: undefined): string;
  encodeFunctionData(functionFragment: "token2", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateReferralManager",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateSquads",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateStaking",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateToken1",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateToken2",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "getUserReferralsFullInfoByLevel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserSquadInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserSquadsInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "referralManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "squads", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "staking", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token1", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token2", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateReferralManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateSquads",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateStaking",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateToken1",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateToken2",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface Helper extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: HelperInterface;

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
    getUserReferralsFullInfoByLevel(
      user: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[Helper.ReferralFullInfoStructOutput[]]>;

    getUserSquadInfo(
      planId: PromiseOrValue<BigNumberish>,
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[Helper.UserSquadInfoStructOutput]>;

    getUserSquadsInfo(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[Helper.UserSquadInfoStructOutput[]]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    referralManager(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    squads(overrides?: CallOverrides): Promise<[string]>;

    staking(overrides?: CallOverrides): Promise<[string]>;

    token1(overrides?: CallOverrides): Promise<[string]>;

    token2(overrides?: CallOverrides): Promise<[string]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateReferralManager(
      _referralManager: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateSquads(
      _squads: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateStaking(
      _staking: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateToken1(
      _token1: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateToken2(
      _token2: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  getUserReferralsFullInfoByLevel(
    user: PromiseOrValue<string>,
    level: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<Helper.ReferralFullInfoStructOutput[]>;

  getUserSquadInfo(
    planId: PromiseOrValue<BigNumberish>,
    user: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<Helper.UserSquadInfoStructOutput>;

  getUserSquadsInfo(
    user: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<Helper.UserSquadInfoStructOutput[]>;

  owner(overrides?: CallOverrides): Promise<string>;

  referralManager(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  squads(overrides?: CallOverrides): Promise<string>;

  staking(overrides?: CallOverrides): Promise<string>;

  token1(overrides?: CallOverrides): Promise<string>;

  token2(overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateReferralManager(
    _referralManager: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateSquads(
    _squads: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateStaking(
    _staking: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateToken1(
    _token1: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateToken2(
    _token2: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getUserReferralsFullInfoByLevel(
      user: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<Helper.ReferralFullInfoStructOutput[]>;

    getUserSquadInfo(
      planId: PromiseOrValue<BigNumberish>,
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<Helper.UserSquadInfoStructOutput>;

    getUserSquadsInfo(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<Helper.UserSquadInfoStructOutput[]>;

    owner(overrides?: CallOverrides): Promise<string>;

    referralManager(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    squads(overrides?: CallOverrides): Promise<string>;

    staking(overrides?: CallOverrides): Promise<string>;

    token1(overrides?: CallOverrides): Promise<string>;

    token2(overrides?: CallOverrides): Promise<string>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateReferralManager(
      _referralManager: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateSquads(
      _squads: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateStaking(
      _staking: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateToken1(
      _token1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateToken2(
      _token2: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    getUserReferralsFullInfoByLevel(
      user: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserSquadInfo(
      planId: PromiseOrValue<BigNumberish>,
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserSquadsInfo(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    referralManager(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    squads(overrides?: CallOverrides): Promise<BigNumber>;

    staking(overrides?: CallOverrides): Promise<BigNumber>;

    token1(overrides?: CallOverrides): Promise<BigNumber>;

    token2(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateReferralManager(
      _referralManager: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateSquads(
      _squads: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateStaking(
      _staking: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateToken1(
      _token1: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateToken2(
      _token2: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getUserReferralsFullInfoByLevel(
      user: PromiseOrValue<string>,
      level: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserSquadInfo(
      planId: PromiseOrValue<BigNumberish>,
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserSquadsInfo(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    referralManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    squads(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    staking(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token1(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token2(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateReferralManager(
      _referralManager: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateSquads(
      _squads: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateStaking(
      _staking: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateToken1(
      _token1: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateToken2(
      _token2: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}