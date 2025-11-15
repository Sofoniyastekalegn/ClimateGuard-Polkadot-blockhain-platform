import { useEffect, useState } from 'react';
import { supabase, ClimateMetric } from '../lib/supabase';
import { TrendingUp, TrendingDown, Minus, Globe, Leaf, Zap, Car } from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<ClimateMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('climate_metrics')
        .select('*')
        .order('metric_name');

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5" />;
      case 'down':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Minus className="w-5 h-5" />;
    }
  };

  const getTrendColor = (trend: string, metric: string) => {
    const isGoodUp = metric.includes('Renewable') || metric.includes('EV') || metric.includes('Reforestation') || metric.includes('Carbon Capture');

    if (trend === 'up') {
      return isGoodUp ? 'text-green-500' : 'text-red-500';
    } else if (trend === 'down') {
      return isGoodUp ? 'text-red-500' : 'text-green-500';
    }
    return 'text-gray-400';
  };

  const getIcon = (metricName: string) => {
    if (metricName.includes('Temperature') || metricName.includes('CO2')) return <Globe className="w-8 h-8" />;
    if (metricName.includes('Renewable') || metricName.includes('Energy')) return <Zap className="w-8 h-8" />;
    if (metricName.includes('EV') || metricName.includes('vehicle')) return <Car className="w-8 h-8" />;
    return <Leaf className="w-8 h-8" />;
  };

  const getProgressPercent = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Globe className="w-12 h-12 text-green-600 animate-pulse" />
            ClimateGuard Dashboard
          </h1>
          <p className="text-xl text-gray-600">Real-time Global Climate Progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const progress = getProgressPercent(metric.current_value, metric.target_value);
            const isGoodMetric = metric.metric_name.includes('Renewable') ||
                                 metric.metric_name.includes('EV') ||
                                 metric.metric_name.includes('Reforestation') ||
                                 metric.metric_name.includes('Carbon Capture');

            return (
              <div
                key={metric.id}
                className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s backwards`
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-green-600">
                    {getIcon(metric.metric_name)}
                  </div>
                  <div className={getTrendColor(metric.trend, metric.metric_name)}>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {metric.metric_name}
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      {metric.current_value}
                    </span>
                    <span className="text-sm text-gray-500">{metric.unit}</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Target: {metric.target_value}</span>
                    {isGoodMetric && <span className="font-semibold text-green-600">{progress}%</span>}
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isGoodMetric ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                      style={{
                        width: `${progress}%`,
                        animation: 'progressBar 1.5s ease-out'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Leaf className="w-8 h-8 text-green-600" />
            What These Numbers Mean
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Progress We're Making</h3>
                <p className="text-sm">Renewable energy adoption is growing worldwide. More countries are switching to clean energy sources like solar and wind power.</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Electric Vehicle Revolution</h3>
                <p className="text-sm">EV adoption is accelerating. Electric cars produce zero direct emissions and help reduce our carbon footprint.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Challenges Ahead</h3>
                <p className="text-sm">CO2 levels are still rising. We need urgent action to reduce emissions and protect our planet for future generations.</p>
              </div>
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Carbon Detection & Reduction</h3>
                <p className="text-sm">Advanced sensors and satellite technology help us detect carbon emissions. By replacing fossil fuels with electric alternatives, we reduce harmful emissions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
