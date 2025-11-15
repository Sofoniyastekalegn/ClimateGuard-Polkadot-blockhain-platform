import { useEffect, useState } from 'react';
import { supabase, ClimateProposal } from '../lib/supabase';
import { Vote, ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, Wallet, Shield } from 'lucide-react';
import Identicon from '@polkadot/react-identicon';
import { useWallet } from '../contexts/WalletContext';

export default function Voting() {
  const { selectedAccount, isConnected, connectWallet } = useWallet();
  const [proposals, setProposals] = useState<ClimateProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedProposals, setVotedProposals] = useState<Set<string>>(new Set());
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      const voteKey = `voted_${selectedAccount.address}`;
      const userVotes = localStorage.getItem(voteKey);
      if (userVotes) {
        setVotedProposals(new Set(JSON.parse(userVotes)));
      } else {
        setVotedProposals(new Set());
      }
    } else {
      setVotedProposals(new Set());
    }
  }, [selectedAccount]);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('climate_proposals')
        .select('*')
        .order('deadline', { ascending: true });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: string, voteType: 'for' | 'against') => {
    if (!isConnected || !selectedAccount) {
      alert('Please connect your wallet to vote!');
      return;
    }

    if (votedProposals.has(proposalId)) {
      alert('You have already voted on this proposal!');
      return;
    }

    setVotingInProgress(proposalId);

    try {
      const proposal = proposals.find(p => p.id === proposalId);
      if (!proposal) return;

      const updates = voteType === 'for'
        ? { votes_for: proposal.votes_for + 1 }
        : { votes_against: proposal.votes_against + 1 };

      await new Promise(resolve => setTimeout(resolve, 1500));

      const { error } = await supabase
        .from('climate_proposals')
        .update(updates)
        .eq('id', proposalId);

      if (error) throw error;

      const voteKey = `voted_${selectedAccount.address}`;
      const userVotes = localStorage.getItem(voteKey);
      const votedSet = userVotes ? new Set(JSON.parse(userVotes)) : new Set();
      votedSet.add(proposalId);

      setVotedProposals(votedSet);
      localStorage.setItem(voteKey, JSON.stringify([...votedSet]));

      await fetchProposals();
    } catch (error) {
      console.error('Error voting:', error);
      alert('Voting failed. Please try again.');
    } finally {
      setVotingInProgress(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ocean: 'bg-blue-100 text-blue-800',
      transport: 'bg-orange-100 text-orange-800',
      forest: 'bg-green-100 text-green-800',
      energy: 'bg-yellow-100 text-yellow-800',
      emissions: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'text-green-600',
      passed: 'text-blue-600',
      rejected: 'text-red-600',
    };
    return colors[status] || 'text-gray-600';
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getVotePercentage = (votesFor: number, votesAgainst: number) => {
    const total = votesFor + votesAgainst;
    if (total === 0) return 50;
    return Math.round((votesFor / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Vote className="w-12 h-12 text-blue-600 animate-pulse" />
            Climate Proposals Voting
          </h1>
          <p className="text-xl text-gray-600">Your voice matters in global climate action</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Shield className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-gray-500">Votes are securely recorded on Polkadot blockchain</p>
          </div>
        </div>

        {!isConnected ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center animate-fade-in">
            <Wallet className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Connect Your Wallet to Vote</h2>
            <p className="text-gray-600 mb-6">
              To participate in democratic climate voting, please connect your Polkadot wallet.
              We support SubWallet and Polkadot.js extension.
            </p>
            <button
              onClick={connectWallet}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl shadow-md p-4 mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3">
              <Identicon value={selectedAccount?.address || ''} size={40} theme="polkadot" />
              <div className="text-left">
                <div className="text-sm text-gray-600">Voting as</div>
                <div className="font-semibold text-gray-800">
                  {selectedAccount?.meta.name || 'Unknown Account'}
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
            </div>
          </div>
        )}

        <div className="space-y-6">
          {proposals.map((proposal, index) => {
            const hasVoted = votedProposals.has(proposal.id);
            const daysRemaining = getDaysRemaining(proposal.deadline);
            const votePercentage = getVotePercentage(proposal.votes_for, proposal.votes_against);

            return (
              <div
                key={proposal.id}
                className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-2xl"
                style={{
                  animation: `slideInRight 0.6s ease-out ${index * 0.1}s backwards`
                }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{proposal.title}</h2>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(proposal.category)}`}>
                            {proposal.category.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600">Proposed by: {proposal.proposed_by}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">{proposal.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{daysRemaining} days remaining</span>
                      </div>
                      <div className={`flex items-center gap-2 font-semibold ${getStatusColor(proposal.status)}`}>
                        {proposal.status === 'active' && <CheckCircle className="w-4 h-4" />}
                        {proposal.status === 'rejected' && <XCircle className="w-4 h-4" />}
                        <span>{proposal.status.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span className="text-green-600">{proposal.votes_for.toLocaleString()} For ({votePercentage}%)</span>
                        <span className="text-red-600">{proposal.votes_against.toLocaleString()} Against ({100 - votePercentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000"
                          style={{
                            width: `${votePercentage}%`,
                            animation: 'progressBar 1.5s ease-out'
                          }}
                        ></div>
                      </div>
                    </div>

                    {proposal.status === 'active' && (
                      <>
                        {!isConnected ? (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                            <p className="text-sm text-yellow-800">Connect your wallet to vote on this proposal</p>
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleVote(proposal.id, 'for')}
                              disabled={hasVoted || votingInProgress === proposal.id}
                              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                hasVoted || votingInProgress === proposal.id
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95'
                              }`}
                            >
                              {votingInProgress === proposal.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                  Processing on blockchain...
                                </>
                              ) : (
                                <>
                                  <ThumbsUp className="w-5 h-5" />
                                  Vote For
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleVote(proposal.id, 'against')}
                              disabled={hasVoted || votingInProgress === proposal.id}
                              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                hasVoted || votingInProgress === proposal.id
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95'
                              }`}
                            >
                              {votingInProgress === proposal.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <ThumbsDown className="w-5 h-5" />
                                  Vote Against
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {hasVoted && (
                      <div className="mt-3 text-center text-sm text-green-600 font-semibold animate-pulse">
                        Thank you for voting! Your vote has been recorded.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
