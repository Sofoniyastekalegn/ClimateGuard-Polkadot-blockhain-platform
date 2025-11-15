import { useEffect, useState } from 'react';
import { supabase, Country, GreenProject } from '../lib/supabase';
import { TrendingUp, Leaf, Zap, Car, Target, Award } from 'lucide-react';

export default function Countries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [projects, setProjects] = useState<GreenProject[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [countriesRes, projectsRes] = await Promise.all([
        supabase.from('countries').select('*').order('current_reduction', { ascending: false }),
        supabase.from('green_projects').select('*')
      ]);

      if (countriesRes.error) throw countriesRes.error;
      if (projectsRes.error) throw projectsRes.error;

      setCountries(countriesRes.data || []);
      setProjects(projectsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCountryProjects = (countryId: string) => {
    return projects.filter(p => p.country_id === countryId);
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'solar':
      case 'wind':
      case 'energy':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'ev':
      case 'transport':
        return <Car className="w-5 h-5 text-blue-500" />;
      case 'reforestation':
      case 'forest':
        return <Leaf className="w-5 h-5 text-green-500" />;
      default:
        return <Target className="w-5 h-5 text-teal-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Award className="w-12 h-12 text-green-600 animate-pulse" />
            Country Climate Progress
          </h1>
          <p className="text-xl text-gray-600">Tracking nations' commitment to climate action</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {countries.map((country, index) => {
            const progressPercent = (country.current_reduction / country.emission_reduction_target) * 100;
            const countryProjects = getCountryProjects(country.id);

            return (
              <div
                key={country.id}
                className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-2xl hover:scale-102 cursor-pointer"
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s backwards`
                }}
                onClick={() => setSelectedCountry(selectedCountry?.id === country.id ? null : country)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{country.flag_emoji}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{country.name}</h2>
                      <p className="text-sm text-gray-500">Click to see details</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${getProgressColor(country.current_reduction, country.emission_reduction_target)}`}>
                    <TrendingUp className="w-6 h-6" />
                    <span className="text-2xl font-bold">{country.current_reduction}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Emission Reduction Progress</span>
                      <span className="font-semibold text-gray-800">
                        {country.current_reduction} / {country.emission_reduction_target}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000"
                        style={{
                          width: `${Math.min(progressPercent, 100)}%`,
                          animation: 'progressBar 1.5s ease-out'
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                        <Zap className="w-4 h-4" />
                        <span className="text-lg font-bold">{country.renewable_energy_percent}%</span>
                      </div>
                      <p className="text-xs text-gray-600">Renewable Energy</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Car className="w-4 h-4" />
                        <span className="text-lg font-bold">{country.electric_vehicle_adoption}%</span>
                      </div>
                      <p className="text-xs text-gray-600">EV Adoption</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                        <Leaf className="w-4 h-4" />
                        <span className="text-lg font-bold">{country.forest_coverage_percent}%</span>
                      </div>
                      <p className="text-xs text-gray-600">Forest Coverage</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Carbon Offset: </span>
                      {(country.carbon_offset_tons / 1000000).toFixed(1)}M tons
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Equivalent to removing {Math.round(country.carbon_offset_tons / 4600)} cars from roads
                    </p>
                  </div>
                </div>

                {selectedCountry?.id === country.id && countryProjects.length > 0 && (
                  <div className="mt-6 pt-6 border-t animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      Green Projects ({countryProjects.length})
                    </h3>
                    <div className="space-y-3">
                      {countryProjects.map((project) => (
                        <div key={project.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-2">
                              {getProjectTypeIcon(project.type)}
                              <div>
                                <h4 className="font-semibold text-gray-800">{project.name}</h4>
                                <p className="text-xs text-gray-500 capitalize">{project.type} • {project.status}</p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                              {project.completion_percent}% Complete
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>
                              <span className="font-semibold">Carbon Reduction:</span> {(project.carbon_reduction_tons / 1000000).toFixed(1)}M tons
                            </div>
                            <div>
                              <span className="font-semibold">Investment:</span> ${(project.investment_usd / 1000000000).toFixed(1)}B
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-500"
                              style={{ width: `${project.completion_percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">How Countries Detect & Reduce Carbon</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Detection</h3>
              <p className="text-sm text-gray-600">
                Satellite monitoring, IoT sensors, and AI analyze emissions in real-time. Countries track carbon output from factories, vehicles, and energy production.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Replace with Electric</h3>
              <p className="text-sm text-gray-600">
                Transitioning to EVs, electric public transport, and renewable energy sources like solar and wind power eliminates fossil fuel emissions.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Green Impact</h3>
              <p className="text-sm text-gray-600">
                Reforestation, carbon capture technology, and sustainable practices offset remaining emissions. Every action contributes to a healthier planet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
