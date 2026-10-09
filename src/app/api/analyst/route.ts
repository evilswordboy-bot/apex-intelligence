import { NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
  sport?: 'cricket' | 'football' | 'olympics' | 'all';
  athlete?: string;
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { message, sport = 'all', athlete } = body;

    // Intelligent sports science knowledge response generator
    const query = (message || '').toLowerCase();
    let reply = '';
    let citations = [
      "APEX Biomechanical Telemetry Engine v3.4",
      "Kinetics & Inertial Load Sensor Stream",
      "StatsBomb / Cricsheet Standard Normalized Dataset"
    ];

    if (query.includes('cricket') || query.includes('kohli') || query.includes('starc') || query.includes('wagon')) {
      reply = `**Cricket Performance Analysis (Match CRI-2026-IND-AUS-WTC)**:
- **Virat Kohli (74 off 41 balls, SR 180.4)**: Scoring distribution shows 42.4% of total boundary yield concentrated in the Mid-Wicket and Square Leg arc.
- **Match Turning Point**: India's win probability surged from 54% in Over 14 to **88%** by Over 18.3, capitalizing on Mitchell Starc's death-over bowling (11.7 ER phase).
- **Technical Recommendation**: Bowlers should target the 6th-stump off-cutter channel on back-of-a-length (7.8m - 8.4m) where Kohli's control percentage drops to 64%.`;
    } else if (query.includes('football') || query.includes('xg') || query.includes('haaland') || query.includes('city') || query.includes('pressing')) {
      reply = `**Football Tactical & Expected Goals Analysis (MCI vs RMA)**:
- **xG Differential**: Manchester City generated **2.84 xG** across 14 shots compared to Real Madrid's **1.12 xG**. Erling Haaland accumulated 1.37 individual xG.
- **Passing Network Core**: Rodri anchored play with 98 passes (94% completion), executing 34 progression links to Kevin De Bruyne in the right half-space.
- **Pressing Vulnerability**: PPDA of 7.2 vs Madrid's 14.8 reflects elite counter-pressing. Real Madrid conceded 4 high turnovers within 35 meters of their goal line.`;
    } else if (query.includes('olympic') || query.includes('sprint') || query.includes('lyles') || query.includes('javelin') || query.includes('neeraj')) {
      reply = `**Olympic Biomechanics & Kinematics Inspection**:
- **Noah Lyles (100m)**: Reached top velocity of **43.8 km/h** at meter 64. Ground contact time averaged **84 ms** (world benchmark: 82 ms). Torso angle at step 7 elevated prematurely by 2.8°.
- **Neeraj Chopra (Javelin)**: Optimal release angle clocked at **34.8°** with 29.4 m/s release velocity. Kinetic transfer efficiency from plant foot to hip separation measured at 96.4%.`;
    } else if (query.includes('injury') || query.includes('fatigue') || query.includes('acwr') || query.includes('workload')) {
      reply = `**Athlete Workload & Fatigue Evaluation**:
- **Haaland ACWR**: Acute-to-Chronic Workload Ratio is at **1.48** (Warning Zone > 1.40). Weekly strain index reached 84/100, driven by fixture density.
- **Protocol**: Recommend reducing sprint interval volume by 20% over the next 48 hours to mitigate hamstring and adductor strain risk.
- *Notice*: Biomechanical workload models represent strain estimates and do not constitute clinical or medical diagnosis.`;
    } else {
      reply = `**APEX Intelligence Overview**:
I have cross-analyzed active telemetry across Cricket, Football, and Olympic disciplines.
- **Cricket**: India leads with 88% win probability in Over 18.
- **Football**: Manchester City dominating field tilt (71%) and xG (2.84 to 1.12).
- **Olympic Track & Field**: Noah Lyles showing 43.8 km/h peak speed with 328 N·s impulse.
- **Workload Status**: 1 athlete (Haaland) flagged for moderate ACWR overload (1.48).

Ask me for deep-dives into wagon wheels, passing networks, stride kinematics, or fatigue deload protocols!`;
    }

    return NextResponse.json({
      status: 'success',
      reply,
      citations,
      timestamp: new Date().toISOString(),
      metadata: {
        model: "APEX-SportsGPT Edge-Assisted Engine",
        confidence: 0.96,
        mode: "deterministic-validated-demo"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process sports analyst request' }, { status: 500 });
  }
}
