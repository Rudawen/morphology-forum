import { useMemo, useState } from 'react';
import { Globe2, MapPin, Users } from 'lucide-react';
import participantGeography from '../../data/participant-cities.json';
import regionCountries from '../../data/region-countries.json';

type Position = [number, number];
type PolygonCoordinates = Position[][];

type RegionGeometry =
  | { type: 'Polygon'; coordinates: PolygonCoordinates }
  | { type: 'MultiPolygon'; coordinates: PolygonCoordinates[] };

type RegionFeature = {
  properties: { code: string; name: string };
  geometry: RegionGeometry;
};

type ParticipantCity = {
  name: string;
  count: number;
  latitude: number;
  longitude: number;
  countryCode: string;
  country: string;
};

type GeographyResponse = {
  totalParticipants: number;
  mappedParticipants: number;
  unmatchedParticipants: number;
  cityCount: number;
  countryCount: number;
  cities: ParticipantCity[];
};

const data = participantGeography as GeographyResponse;

const VIEWBOX_WIDTH = 1120;
const VIEWBOX_HEIGHT = 500;
const HORIZONTAL_PADDING = 24;
const VERTICAL_PADDING = 24;
const MIN_LONGITUDE = 18;
const MAX_LONGITUDE = 191;
const MIN_LATITUDE = 34;
const MAX_LATITUDE = 82;

function project(longitude: number, latitude: number) {
  const wrappedLongitude = longitude < 0 ? longitude + 360 : longitude;
  const x =
    HORIZONTAL_PADDING +
    ((wrappedLongitude - MIN_LONGITUDE) / (MAX_LONGITUDE - MIN_LONGITUDE)) *
      (VIEWBOX_WIDTH - HORIZONTAL_PADDING * 2);
  const y =
    VERTICAL_PADDING +
    ((MAX_LATITUDE - latitude) / (MAX_LATITUDE - MIN_LATITUDE)) *
      (VIEWBOX_HEIGHT - VERTICAL_PADDING * 2);

  return [x, y] as const;
}

function ringToPath(ring: Position[]) {
  return ring
    .map(([longitude, latitude], index) => {
      const [x, y] = project(longitude, latitude);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function geometryToPath(geometry: RegionGeometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;

  return polygons
    .map((polygon) => polygon.map((ring) => `${ringToPath(ring)} Z`).join(' '))
    .join(' ');
}

function pluralize(value: number, forms: [string, string, string]) {
  const lastTwoDigits = value % 100;
  const lastDigit = value % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return forms[2];
  if (lastDigit === 1) return forms[0];
  if (lastDigit >= 2 && lastDigit <= 4) return forms[1];
  return forms[2];
}

export function ParticipantGeography() {
  const [activeCity, setActiveCity] = useState<string | null>(null);

  const countryPaths = useMemo(
    () =>
      (regionCountries.features as RegionFeature[]).map((feature) => ({
        code: feature.properties.code,
        name: feature.properties.name,
        path: geometryToPath(feature.geometry),
      })),
    []
  );

  const citiesForMap = useMemo(
    () => [...data.cities].sort((left, right) => left.count - right.count),
    []
  );

  const activeCityData = data.cities.find((city) => city.name === activeCity) || null;

  return (
    <section id="geography" className="overflow-hidden bg-[#0A2A3A] px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-9 max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#DCC98D]">
            География форума
          </p>
          <h2 className="mb-4 text-3xl md:text-4xl">Города наших участников</h2>
          <p className="text-sm leading-relaxed text-white/72 md:text-base">
            Петербургский Морфологический Форум объединяет специалистов из разных регионов России
            и ближнего зарубежья.
          </p>
        </div>

        <>
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <GeographyStat
                icon={Users}
                value={data.totalParticipants}
                label={pluralize(data.totalParticipants, ['участник', 'участника', 'участников'])}
              />
              <GeographyStat
                icon={MapPin}
                value={data.cityCount}
                label={pluralize(data.cityCount, ['город', 'города', 'городов'])}
              />
              <GeographyStat
                icon={Globe2}
                value={data.countryCount}
                label={pluralize(data.countryCount, ['страна', 'страны', 'стран'])}
              />
            </div>

            <div className="rounded-2xl border border-white/12 bg-[#0D3142] p-3 shadow-2xl shadow-black/15 md:p-6">
              <div className="overflow-x-auto pb-2">
                <svg
                  viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                  className="h-auto min-w-[760px] w-full"
                  role="img"
                  aria-label="Карта городов участников форума"
                >
                  <defs>
                    <filter id="participant-marker-glow" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <g>
                    {countryPaths.map((country) => (
                      <path
                        key={country.code}
                        d={country.path}
                        fill="#153E52"
                        stroke="#6E8A96"
                        strokeWidth="1.1"
                        vectorEffect="non-scaling-stroke"
                      >
                        <title>{country.name}</title>
                      </path>
                    ))}
                  </g>

                  <g>
                    {citiesForMap.map((city) => {
                      const [x, y] = project(city.longitude, city.latitude);
                      const radius = Math.min(17, 5.5 + Math.sqrt(city.count) * 1.45);
                      const isActive = activeCity === city.name;

                      return (
                        <g
                          key={`${city.countryCode}-${city.name}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`${city.name}: ${city.count} ${pluralize(city.count, [
                            'участник',
                            'участника',
                            'участников',
                          ])}`}
                          onMouseEnter={() => setActiveCity(city.name)}
                          onMouseLeave={() => setActiveCity(null)}
                          onFocus={() => setActiveCity(city.name)}
                          onBlur={() => setActiveCity(null)}
                          onClick={() => setActiveCity(isActive ? null : city.name)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setActiveCity(isActive ? null : city.name);
                            }
                          }}
                          className="cursor-pointer outline-none"
                        >
                          <circle
                            cx={x}
                            cy={y}
                            r={radius + 5}
                            fill="#B8A16A"
                            opacity={isActive ? 0.34 : 0.16}
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r={radius}
                            fill="#B8A16A"
                            stroke="#F4E8BD"
                            strokeWidth={isActive ? 2.5 : 1.4}
                            filter="url(#participant-marker-glow)"
                            vectorEffect="non-scaling-stroke"
                          />
                          <text
                            x={x}
                            y={y + 4}
                            textAnchor="middle"
                            fill="#0A2A3A"
                            fontSize={Math.max(10, Math.min(14, radius))}
                            fontWeight="700"
                            pointerEvents="none"
                          >
                            {city.count}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {activeCityData && <CityTooltip city={activeCityData} />}
                </svg>
              </div>
              <p className="mt-1 text-center text-xs text-white/50 md:hidden">
                Проведите по карте и нажимайте на золотые отметки
              </p>
            </div>

            <div className="mt-6 grid max-h-72 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {data.cities.map((city) => (
                <button
                  key={`${city.countryCode}-${city.name}-list`}
                  type="button"
                  onClick={() => setActiveCity(city.name)}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-left transition hover:border-[#B8A16A]/55 hover:bg-white/[0.09]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-white">{city.name}</span>
                    <span className="block text-xs text-white/52">{city.country}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-[#B8A16A] px-2.5 py-1 text-xs font-bold text-[#0A2A3A]">
                    {city.count}
                  </span>
                </button>
              ))}
            </div>
        </>
      </div>
    </section>
  );
}

function GeographyStat({ icon: Icon, value, label }: { icon: typeof Users; value: number; label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.065] px-5 py-4">
      <Icon className="h-5 w-5 text-[#B8A16A]" aria-hidden="true" />
      <p>
        <strong className="mr-1.5 text-xl text-[#DCC98D]">{value}</strong>
        <span className="text-sm text-white/70">{label}</span>
      </p>
    </div>
  );
}

function CityTooltip({ city }: { city: ParticipantCity }) {
  const [rawX, rawY] = project(city.longitude, city.latitude);
  const width = Math.max(150, Math.min(230, city.name.length * 8.5 + 44));
  const height = 62;
  const x = Math.max(8, Math.min(VIEWBOX_WIDTH - width - 8, rawX - width / 2));
  const y = rawY > 90 ? rawY - height - 24 : rawY + 24;

  return (
    <g pointerEvents="none">
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="11"
        fill="#F8F4E8"
        stroke="#B8A16A"
        strokeWidth="1.5"
      />
      <text x={x + 14} y={y + 25} fill="#0A2A3A" fontSize="15" fontWeight="700">
        {city.name}
      </text>
      <text x={x + 14} y={y + 46} fill="#53636C" fontSize="12.5">
        {city.count} {pluralize(city.count, ['участник', 'участника', 'участников'])} · {city.country}
      </text>
    </g>
  );
}
