import {
  CastVote,
  StartVote,
  ExecuteVote,
  UpdateConfig,
  ERC20Voting
} from '../../../generated/templates/ERC20Voting/ERC20Voting';
import {
  Action,
  ERC20VotingPackage,
  ERC20VotingProposal,
  ERC20VotingVoter,
  ERC20Vote
} from '../../../generated/schema';
import {dataSource} from '@graphprotocol/graph-ts';
import {VOTER_STATE} from '../../utils/constants';

export function handleStartVote(event: StartVote): void {
  let context = dataSource.context();
  let daoId = context.getString('daoAddress');

  _handleStartVote(event, daoId);
}

export function _handleStartVote(event: StartVote, daoId: string): void {
  let proposalId =
    event.address.toHexString() + '_' + event.params.voteId.toHexString();

  let proposalEntity = new ERC20VotingProposal(proposalId);
  proposalEntity.dao = daoId;
  proposalEntity.pkg = event.address.toHexString();
  proposalEntity.voteId = event.params.voteId;
  proposalEntity.creator = event.params.creator;
  proposalEntity.description = event.params.description.toString();
  proposalEntity.createdAt = event.block.timestamp;

  let contract = ERC20Voting.bind(event.address);
  let vote = contract.try_getVote(event.params.voteId);

  if (!vote.reverted) {
    proposalEntity.executed = vote.value.value1;
    proposalEntity.startDate = vote.value.value2;
    proposalEntity.endDate = vote.value.value3;
    proposalEntity.snapshotBlock = vote.value.value4;
    proposalEntity.supportRequiredPct = vote.value.value5;
    proposalEntity.participationRequiredPct = vote.value.value6;
    proposalEntity.votingPower = vote.value.value7;

    // actions
    let actions = vote.value.value11;
    for (let index = 0; index < actions.length; index++) {
      const action = actions[index];

      let actionId =
        event.address.toHexString() +
        '_' +
        event.params.voteId.toHexString() +
        '_' +
        index.toString();

      let actionEntity = new Action(actionId);
      actionEntity.to = action.to;
      actionEntity.value = action.value;
      actionEntity.data = action.data;
      actionEntity.dao = daoId;
      actionEntity.proposal = proposalId;
      actionEntity.save();
    }
  }

  proposalEntity.save();

  // update vote length
  let packageEntity = ERC20VotingPackage.load(event.address.toHexString());
  if (packageEntity) {
    let voteLength = contract.try_votesLength();
    if (!voteLength.reverted) {
      packageEntity.votesLength = voteLength.value;
      packageEntity.save();
    }
  }
}

export function handleCastVote(event: CastVote): void {
  let proposalId =
    event.address.toHexString() + '_' + event.params.voteId.toHexString();
  let voterProposalId = event.params.voter.toHexString() + '_' + proposalId;
  let voterProposalEntity = ERC20Vote.load(voterProposalId);
  if (!voterProposalEntity) {
    voterProposalEntity = new ERC20Vote(voterProposalId);
    voterProposalEntity.voter = event.params.voter.toHexString();
    voterProposalEntity.proposal = proposalId;
  }
  voterProposalEntity.vote = VOTER_STATE.get(event.params.voterState);
  voterProposalEntity.stake = event.params.stake;
  voterProposalEntity.createdAt = event.block.timestamp;
  voterProposalEntity.save();

  // voter
  let voterEntity = ERC20VotingVoter.load(event.params.voter.toHexString());
  if (!voterEntity) {
    voterEntity = new ERC20VotingVoter(event.params.voter.toHexString());
    voterEntity.save();
  }

  // update count
  let proposalEntity = ERC20VotingProposal.load(proposalId);
  if (proposalEntity) {
    let contract = ERC20Voting.bind(event.address);
    let vote = contract.try_getVote(event.params.voteId);
    if (!vote.reverted) {
      proposalEntity.yea = vote.value.value8;
      proposalEntity.nay = vote.value.value9;
      proposalEntity.abstain = vote.value.value10;
      proposalEntity.save();
    }
  }
}

export function handleExecuteVote(event: ExecuteVote): void {
  let proposalId =
    event.address.toHexString() + '_' + event.params.voteId.toHexString();
  let proposalEntity = ERC20VotingProposal.load(proposalId);
  if (proposalEntity) {
    proposalEntity.executed = true;
    proposalEntity.save();
  }

  // update actions
  let contract = ERC20Voting.bind(event.address);
  let vote = contract.try_getVote(event.params.voteId);
  if (!vote.reverted) {
    let actions = vote.value.value11;
    for (let index = 0; index < actions.length; index++) {
      let actionId =
        event.address.toHexString() +
        '_' +
        event.params.voteId.toHexString() +
        '_' +
        index.toString();

      let actionEntity = Action.load(actionId);
      if (actionEntity) {
        actionEntity.execResult = event.params.execResults[index];
        actionEntity.save();
      }
    }
  }
}

export function handleUpdateConfig(event: UpdateConfig): void {
  let packageEntity = ERC20VotingPackage.load(event.address.toHexString());
  if (packageEntity) {
    packageEntity.supportRequiredPct = event.params.supportRequiredPct;
    packageEntity.participationRequiredPct =
      event.params.participationRequiredPct;
    packageEntity.minDuration = event.params.minDuration;
    packageEntity.save();
  }
}
