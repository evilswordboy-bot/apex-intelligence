"""
APEX AI — Olympic Natural Language Query (NLQ) Engine
Intelligent query parser, intent classifier, and analytical response generator.
Processes free-text queries, resolves sport/country entities, runs validated SQL/Pandas computations,
and generates structured JSON summaries, markdown answers, and chart configurations.
"""
import time
import re
from typing import Dict, Any, List, Optional
from app.services.olympic_service import (
    get_overview_summary,
    get_athletes,
    get_athlete_detail,
    get_coaches,
    get_teams,
    get_medals_table,
    get_nation_dossier,
    get_gender_participation,
    get_disciplines_summary,
    get_discipline_detail,
    get_delegation_efficiency,
    get_correlation_analysis,
    get_gini_analysis,
    resolve_noc_name,
    NOC_ALIASES
)

DISCIPLINE_KEYWORDS = [
    "3x3 basketball", "archery", "artistic gymnastics", "artistic swimming", "athletics",
    "badminton", "baseball/softball", "basketball", "beach volleyball", "boxing",
    "canoe slalom", "canoe sprint", "cycling bmx freestyle", "cycling bmx racing",
    "cycling mountain bike", "cycling road", "cycling track", "diving", "equestrian",
    "fencing", "football", "golf", "handball", "hockey", "judo", "karate", "marathon swimming",
    "modern pentathlon", "rhythmic gymnastics", "rowing", "rugby sevens", "sailing",
    "shooting", "skateboarding", "sport climbing", "surfing", "swimming", "table tennis",
    "taekwondo", "tennis", "trampoline gymnastics", "triathlon", "volleyball", "water polo",
    "weightlifting", "wrestling"
]

def extract_entity_noc(query: str) -> Optional[str]:
    q_lower = query.lower()
    for alias, official in NOC_ALIASES.items():
        pattern = r'\b' + re.escape(alias) + r'\b'
        if re.search(pattern, q_lower):
            return official
    # Check if any words match official NOC
    medals = get_medals_table(limit=100)["items"]
    for m in medals:
        noc_name = m["noc"].lower()
        if noc_name in q_lower or (len(noc_name.split()) > 1 and all(w in q_lower for w in noc_name.split()[:2])):
            return m["noc"]
    return None

def extract_entity_discipline(query: str) -> Optional[str]:
    q_lower = query.lower()
    for disc in DISCIPLINE_KEYWORDS:
        if disc in q_lower:
            # Capitalize to match official
            gender_data = get_gender_participation()["disciplines"]
            for d in gender_data:
                if d["discipline"].lower() == disc:
                    return d["discipline"]
    return None

def process_olympic_nlq(query: str, include_chart: bool = True) -> Dict[str, Any]:
    t0 = time.perf_counter()
    q = query.strip()
    q_lower = q.lower()

    detected_intent = "general_inquiry"
    confidence = 0.90
    answer_md = ""
    data_summary: Dict[str, Any] = {}
    chart_config: Optional[Dict[str, Any]] = None
    sources = ["Tokyo 2020 Olympic Games Validated Dataset"]

    # 1. Comparison Query (e.g., "compare USA and China", "who won more medals USA or China")
    if "compare" in q_lower or (" vs " in q_lower) or (" or " in q_lower and ("medal" in q_lower or "better" in q_lower)):
        detected_intent = "nation_comparison"
        confidence = 0.96
        # Find all NOCs in query
        found_nocs = []
        for alias, official in NOC_ALIASES.items():
            if re.search(r'\b' + re.escape(alias) + r'\b', q_lower):
                if official not in found_nocs:
                    found_nocs.append(official)
        
        if len(found_nocs) >= 2:
            d1 = get_nation_dossier(found_nocs[0])
            d2 = get_nation_dossier(found_nocs[1])
            m1 = d1["medal_record"] if d1 else None
            m2 = d2["medal_record"] if d2 else None

            answer_md = f"### ⚔️ Olympic Head-to-Head: **{found_nocs[0]}** vs **{found_nocs[1]}**\n\n"
            answer_md += f"| Metric | {found_nocs[0]} | {found_nocs[1]} |\n"
            answer_md += f"| :--- | :--- | :--- |\n"
            answer_md += f"| **Medal Rank** | #{m1['rank'] if m1 else 'N/A'} | #{m2['rank'] if m2 else 'N/A'} |\n"
            answer_md += f"| **Gold Medals** | **{m1['gold'] if m1 else 0}** | **{m2['gold'] if m2 else 0}** |\n"
            answer_md += f"| **Silver Medals** | {m1['silver'] if m1 else 0} | {m2['silver'] if m2 else 0} |\n"
            answer_md += f"| **Bronze Medals** | {m1['bronze'] if m1 else 0} | {m2['bronze'] if m2 else 0} |\n"
            answer_md += f"| **Total Medals** | **{m1['total'] if m1 else 0}** | **{m2['total'] if m2 else 0}** |\n"
            answer_md += f"| **Athlete Contingent** | {d1['total_athletes'] if d1 else 0} | {d2['total_athletes'] if d2 else 0} |\n"
            answer_md += f"| **Medals per 100 Athletes** | {d1['medals_per_100_athletes'] if d1 else 0}% | {d2['medals_per_100_athletes'] if d2 else 0}% |\n"
            answer_md += f"| **Gold Conversion Rate** | {d1['gold_conversion_rate'] if d1 else 0}% | {d2['gold_conversion_rate'] if d2 else 0}% |\n\n"
            
            if m1 and m2:
                winner = found_nocs[0] if m1["rank"] < m2["rank"] else found_nocs[1]
                answer_md += f"🏆 **{winner}** ranked higher overall based on official IOC gold-medal priority ordering."

            data_summary = {
                "nation_1": found_nocs[0],
                "nation_2": found_nocs[1],
                "dossier_1": d1,
                "dossier_2": d2
            }

            if include_chart:
                chart_config = {
                    "chart_type": "bar",
                    "title": f"Medal Comparison: {found_nocs[0]} vs {found_nocs[1]}",
                    "x_axis_key": "nation",
                    "data_keys": ["gold", "silver", "bronze", "total"],
                    "data": [
                        {"nation": found_nocs[0], "gold": m1["gold"] if m1 else 0, "silver": m1["silver"] if m1 else 0, "bronze": m1["bronze"] if m1 else 0, "total": m1["total"] if m1 else 0},
                        {"nation": found_nocs[1], "gold": m2["gold"] if m2 else 0, "silver": m2["silver"] if m2 else 0, "bronze": m2["bronze"] if m2 else 0, "total": m2["total"] if m2 else 0}
                    ]
                }
            sources.append("Medals.xlsx — Official Tokyo 2020 Medal Tally")

    # 2. Gender Parity & Participation Query
    elif any(k in q_lower for k in ["gender", "female", "women", "male", "men", "parity", "equality", "ratio"]):
        detected_intent = "gender_analysis"
        confidence = 0.97
        g_data = get_gender_participation()
        target_disc = extract_entity_discipline(q)

        if target_disc:
            # Query about specific discipline gender
            disc_item = next((d for d in g_data["disciplines"] if d["discipline"].lower() == target_disc.lower()), None)
            if disc_item:
                answer_md = f"### ⚖️ Gender Participation in **{disc_item['discipline']}**\n\n"
                answer_md += f"- **Female Participants**: **{disc_item['female']}** ({round(disc_item['female_ratio'] * 100, 1)}%)\n"
                answer_md += f"- **Male Participants**: **{disc_item['male']}** ({round(disc_item['male_ratio'] * 100, 1)}%)\n"
                answer_md += f"- **Total Field**: {disc_item['total']} athletes\n"
                answer_md += f"- **Parity Category**: `{disc_item['parity_category']}`\n"
                answer_md += f"- **Absolute Parity Gap**: {round(disc_item['gender_parity_gap'] * 100, 1)}%\n"

                data_summary = disc_item
                if include_chart:
                    chart_config = {
                        "chart_type": "pie",
                        "title": f"Gender Distribution: {disc_item['discipline']}",
                        "x_axis_key": "gender",
                        "data_keys": ["count"],
                        "data": [
                            {"gender": "Female", "count": disc_item["female"]},
                            {"gender": "Male", "count": disc_item["male"]}
                        ]
                    }
        else:
            # Overall Olympic gender query
            answer_md = f"### ⚖️ Olympic Games Overall Gender Parity Analysis\n\n"
            answer_md += f"Tokyo 2020 marked the **most gender-balanced Olympic Games in history**:\n\n"
            answer_md += f"- **Total Female Athletes**: **{g_data['total_female']:,}** ({g_data['overall_female_percent']}%)\n"
            answer_md += f"- **Total Male Athletes**: **{g_data['total_male']:,}** ({g_data['overall_male_percent']}%)\n"
            answer_md += f"- **Total Athlete Pool**: **{g_data['overall_total']:,}**\n"
            answer_md += f"- **Global Parity Index**: **{g_data['parity_index']}** (out of 1.000)\n"
            answer_md += f"- **Balanced Disciplines**: **{g_data['balanced_disciplines_count']}** of 46 sports\n\n"
            answer_md += "#### Top Female-Dominated Disciplines:\n"
            top_fem = sorted(g_data["disciplines"], key=lambda x: x["female_ratio"], reverse=True)[:3]
            for d in top_fem:
                answer_md += f"- **{d['discipline']}**: {round(d['female_ratio'] * 100, 1)}% Female ({d['female']} F / {d['male']} M)\n"

            data_summary = {
                "overall_female_percent": g_data["overall_female_percent"],
                "overall_male_percent": g_data["overall_male_percent"],
                "total_female": g_data["total_female"],
                "total_male": g_data["total_male"],
                "parity_index": g_data["parity_index"]
            }

            if include_chart:
                chart_config = {
                    "chart_type": "bar",
                    "title": "Top Disciplines by Female Participation Ratio (%)",
                    "x_axis_key": "discipline",
                    "data_keys": ["female_percent"],
                    "data": [
                        {"discipline": d["discipline"], "female_percent": round(d["female_ratio"] * 100, 1)}
                        for d in sorted(g_data["disciplines"], key=lambda x: x["female_ratio"], reverse=True)[:8]
                    ]
                }
        sources.append("EntriesGender.xlsx — Official Discipline Gender Registry")

    # 3. Efficiency & Correlation Query
    elif any(k in q_lower for k in ["efficient", "efficiency", "correlation", "yield", "per athlete", "gini", "inequality"]):
        detected_intent = "statistical_analytics"
        confidence = 0.95

        if "gini" in q_lower or "inequality" in q_lower:
            gini = get_gini_analysis()
            answer_md = f"### 📊 Olympic Medal Distribution Inequality (Gini Analysis)\n\n"
            answer_md += f"- **Gini Coefficient**: **{gini['gini_coefficient']}**\n"
            answer_md += f"- **Top 10% Nations Share**: **{gini['top_10_percent_medal_share']}%** of all medals\n"
            answer_md += f"- **Top 20% Nations Share**: **{gini['top_20_percent_medal_share']}%** of all medals\n"
            answer_md += f"- **Bottom 50% Nations Share**: Only **{gini['bottom_50_percent_medal_share']}%** of medals\n\n"
            answer_md += f"**Interpretation**: {gini['interpretation']}"
            data_summary = gini
        else:
            eff = get_delegation_efficiency(min_athletes=5)
            corr = get_correlation_analysis()
            top5_eff = eff["items"][:5]

            answer_md = f"### ⚡ Delegation Efficiency & Correlation Analysis\n\n"
            answer_md += f"**Statistical Correlation**: Pearson $r$ = **{corr['pearson_r']}** ($R^2$ = {corr['r_squared']}).\n"
            answer_md += f"Contingent size is a powerful predictor of podium success, explaining **{round(corr['r_squared'] * 100, 1)}%** of medal variance.\n\n"
            answer_md += "#### Top 5 Most Efficient Delegations (Medals per Athlete):\n\n"
            answer_md += "| Rank | Nation | Athletes | Medals | Medals / Athlete | Gold Ratio |\n"
            answer_md += "| :--- | :--- | :--- | :--- | :--- | :--- |\n"
            for idx, item in enumerate(top5_eff, 1):
                answer_md += f"| {idx} | **{item['noc']}** | {item['total_athletes']} | {item['total_medals']} | **{item['medals_per_athlete']}** | {round(item['gold_ratio']*100, 1)}% |\n"

            data_summary = {
                "correlation": corr["pearson_r"],
                "r_squared": corr["r_squared"],
                "top_efficient_nation": top5_eff[0]["noc"] if top5_eff else "N/A"
            }

            if include_chart:
                chart_config = {
                    "chart_type": "bar",
                    "title": "Top Delegations by Medals Won Per Athlete Fielded",
                    "x_axis_key": "noc",
                    "data_keys": ["medals_per_athlete"],
                    "data": [
                        {"noc": i["noc"], "medals_per_athlete": i["medals_per_athlete"]}
                        for i in top5_eff
                    ]
                }
        sources.append("Athletes.xlsx & Medals.xlsx — Cross-Table Efficiency Model")

    # 4. Nation-Specific Query (e.g., "India medals", "how many athletes for USA", "France in Olympics")
    elif extract_entity_noc(q):
        target_noc = extract_entity_noc(q)
        detected_intent = "nation_dossier"
        confidence = 0.95
        dossier = get_nation_dossier(target_noc)

        if dossier:
            med = dossier["medal_record"]
            answer_md = f"### 🏛️ Olympic Dossier: **{dossier['noc']}**\n\n"
            if med:
                answer_md += f"**Official Medal Standing**: Rank **#{med['rank']}** in Tokyo 2020\n"
                answer_md += f"- 🥇 **Gold**: **{med['gold']}**\n"
                answer_md += f"- 🥈 **Silver**: **{med['silver']}**\n"
                answer_md += f"- 🥉 **Bronze**: **{med['bronze']}**\n"
                answer_md += f"- 🏅 **Total Medals**: **{med['total']}** (Rank #{med['rank_by_total']} by Total)\n"
                answer_md += f"- ⚖️ **Weighted Score**: {med['weighted_score']} pts ($3G + 2S + 1B$)\n\n"
            else:
                answer_md += f"*Did not secure a podium medal in Tokyo 2020.*\n\n"

            answer_md += f"**Delegation Profile**:\n"
            answer_md += f"- **Athletes Fielded**: **{dossier['total_athletes']}** ({dossier['athlete_share_percent']}% of global participants)\n"
            answer_md += f"- **Coaches Registered**: {dossier['total_coaches']}\n"
            answer_md += f"- **Team Event Entries**: {dossier['total_teams']}\n"
            answer_md += f"- **Disciplines Contested**: {len(dossier['disciplines_entered'])}\n"
            if dossier["medals_per_100_athletes"]:
                answer_md += f"- **Conversion Efficiency**: {dossier['medals_per_100_athletes']} medals per 100 athletes\n"

            data_summary = dossier

            if include_chart and med and med["total"] > 0:
                chart_config = {
                    "chart_type": "pie",
                    "title": f"Medal Composition for {dossier['noc']}",
                    "x_axis_key": "type",
                    "data_keys": ["count"],
                    "data": [
                        {"type": "Gold", "count": med["gold"]},
                        {"type": "Silver", "count": med["silver"]},
                        {"type": "Bronze", "count": med["bronze"]}
                    ]
                }
        sources.append("Medals.xlsx & Athletes.xlsx — National Delegation Audit")

    # 5. Discipline-Specific Query
    elif extract_entity_discipline(q):
        target_disc = extract_entity_discipline(q)
        detected_intent = "discipline_profile"
        confidence = 0.94
        disc_detail = get_discipline_detail(target_disc)

        if disc_detail:
            answer_md = f"### 🎯 Discipline Dossier: **{disc_detail['discipline']}**\n\n"
            answer_md += f"- **Total Competitors**: **{disc_detail['athlete_count']}** athletes\n"
            answer_md += f"- **Gender Split**: 👩 {disc_detail['female_count']} Female ({disc_detail['female_percent']}%) • 👨 {disc_detail['male_count']} Male\n"
            answer_md += f"- **Participating Delegations**: {disc_detail['participating_nations_count']} nations\n"
            answer_md += f"- **Registered Team Events**: {len(disc_detail['teams'])}\n"
            answer_md += f"- **Accredited Coaches**: {len(disc_detail['coaches'])}\n\n"

            if disc_detail["top_nations"]:
                answer_md += "#### Top 5 Delegations by Athlete Count:\n"
                for n in disc_detail["top_nations"][:5]:
                    answer_md += f"- **{n['noc']}**: {n['athlete_count']} athletes\n"

            data_summary = disc_detail

            if include_chart and disc_detail["top_nations"]:
                chart_config = {
                    "chart_type": "bar",
                    "title": f"Top Delegations in {disc_detail['discipline']}",
                    "x_axis_key": "noc",
                    "data_keys": ["athlete_count"],
                    "data": disc_detail["top_nations"][:6]
                }
        sources.append("Athletes.xlsx & EntriesGender.xlsx — Discipline Census")

    # 6. Athlete Search Query
    elif any(k in q_lower for k in ["athlete", "player", "who is", "search athlete", "lyles", "biles", "neeraj"]):
        detected_intent = "athlete_search"
        confidence = 0.91

        # Strip prefixes
        clean_name = re.sub(r'(who is|search athlete|athlete|player|about)\s*', '', q_lower).strip()
        ath = get_athlete_detail(clean_name)

        if ath:
            answer_md = f"### 🏃 Athlete Profile: **{ath['name']}**\n\n"
            answer_md += f"- **Country (NOC)**: **{ath['noc']}**\n"
            answer_md += f"- **Discipline**: **{ath['discipline']}**\n"
            answer_md += f"- **National Contingent Size**: {ath['delegation_total_athletes']} athletes\n"
            if ath["nation_medal_rank"]:
                answer_md += f"- **National Medal Rank**: #{ath['nation_medal_rank']} ({ath['nation_gold_medals']} Gold, {ath['nation_total_medals']} Total Medals)\n"
            if ath["coaches"]:
                answer_md += f"- **National Coaches in {ath['discipline']}**: {', '.join(ath['coaches'][:3])}\n"
            if ath["team_events"]:
                answer_md += f"- **Associated Team Events**: {', '.join(ath['team_events'][:2])}\n"

            data_summary = ath
        else:
            # Fuzzy athlete search
            res = get_athletes(q=clean_name, limit=5)
            if res["items"]:
                answer_md = f"### 🔍 Athlete Search Results for \"{clean_name}\":\n\n"
                for item in res["items"]:
                    answer_md += f"- **{item['name']}** — {item['noc']} (*{item['discipline']}*)\n"
                data_summary = res
            else:
                answer_md = f"No athlete record found matching \"{clean_name}\" in the Tokyo 2020 verified registry."
        sources.append("Athletes.xlsx — Global Competitor Roster")

    # 7. General Medals Query (e.g. "top 10 countries", "who won the most gold", "medal standings")
    elif any(k in q_lower for k in ["medal", "rank", "winner", "standing", "tally", "table"]):
        detected_intent = "medal_standings"
        confidence = 0.98

        med_res = get_medals_table(sort_by="gold", limit=10)
        top10 = med_res["items"]

        answer_md = "### 🏅 Olympic Medal Standings (Top 10 Nations)\n\n"
        answer_md += "| Rank | Nation | 🥇 Gold | 🥈 Silver | 🥉 Bronze | 🏅 Total | Pts |\n"
        answer_md += "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"
        for m in top10:
            answer_md += f"| {m['rank']} | **{m['noc']}** | **{m['gold']}** | {m['silver']} | {m['bronze']} | **{m['total']}** | {m['weighted_score']} |\n"

        answer_md += f"\n*A total of **{med_res['total_medals']}** medals (**{med_res['total_gold']}** Gold) were awarded across **{med_res['total_nations']}** podium-finishing nations.*"

        data_summary = {
            "top_10": top10,
            "total_medals": med_res["total_medals"],
            "total_gold": med_res["total_gold"]
        }

        if include_chart:
            chart_config = {
                "chart_type": "bar",
                "title": "Top 10 Nations by Gold and Total Medals",
                "x_axis_key": "noc",
                "data_keys": ["gold", "total"],
                "data": [
                    {"noc": m["noc"], "gold": m["gold"], "total": m["total"]}
                    for m in top10
                ]
            }
        sources.append("Medals.xlsx — Official Tokyo 2020 Medal Table")

    # 8. General Overview Fallback
    else:
        detected_intent = "general_overview"
        confidence = 0.88
        overview = get_overview_summary()

        answer_md = f"### 🌐 APEX AI Olympic Intelligence Engine Overview\n\n"
        answer_md += f"The verified **Tokyo 2020 Olympic Games** database comprises **{overview['total_athletes']:,}** athletes from **{overview['total_nations']}** nations competing across **{overview['total_disciplines']}** disciplines.\n\n"
        answer_md += f"- 🏆 **Top Nation by Gold**: **{overview['top_nation_by_gold']}**\n"
        answer_md += f"- 🏅 **Top Nation by Total Medals**: **{overview['top_nation_by_total']}**\n"
        answer_md += f"- 👩 **Global Gender Parity**: **{overview['overall_female_percent']}%** Female vs **{overview['overall_male_percent']}%** Male\n"
        answer_md += f"- 🎯 **Most Participated Discipline**: **{overview['most_participated_discipline']}**\n"
        answer_md += f"- ⚡ **Most Efficient Contingent**: **{overview['most_efficient_nation']}**\n\n"
        answer_md += "You can ask natural-language inquiries such as:\n"
        answer_md += "- *'Who won the most medals?'*\n"
        answer_md += "- *'Compare USA and China'* \n"
        answer_md += "- *'What is the gender ratio in Swimming?'*\n"
        answer_md += "- *'How many athletes competed for India?'*\n"
        answer_md += "- *'Show delegation efficiency rankings'*"

        data_summary = overview
        sources.append("Official Olympic Games Registry (Athletes, Coaches, Gender, Medals, Teams)")

    t1 = time.perf_counter()
    execution_time_ms = round((t1 - t0) * 1000, 2)

    return {
        "status": "success",
        "query": q,
        "detected_intent": detected_intent,
        "confidence": confidence,
        "answer_markdown": answer_md,
        "data_summary": data_summary,
        "chart": chart_config,
        "sources": sources,
        "execution_time_ms": execution_time_ms
    }
