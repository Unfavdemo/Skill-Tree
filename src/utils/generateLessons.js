// src/utils/generateLessons.js
// ========================================
// 🤖 AI LESSON GENERATION UTILITY
// ========================================
// Generates personalized learning lessons (OpenAI GPT-4o-mini) with rich fallbacks.

import { parseJsonArrayFromContent } from "../lib/parseAiJson";

/** Target lesson count per generation (skills list, dashboard, AI). */
export const LESSON_TARGET_COUNT = 8;

function primaryIndustryLabel(careerAnswers) {
  const list = careerAnswers?.industryInterests || [];
  return list[0] || "your profession";
}

function normalizeChallenge(c) {
  return {
    scenario: c.scenario || "A realistic scenario to practice the skill.",
    question: c.question || "Apply the skill to solve this challenge.",
    hint: c.hint || "Think critically and use best practices.",
  };
}

function normalizeLesson(lesson) {
  return {
    title: lesson.title || "Untitled Lesson",
    description: lesson.description || "No description available.",
    relevance: lesson.relevance || "Relevant to your career growth.",
    challenges: Array.isArray(lesson.challenges)
      ? lesson.challenges.map(normalizeChallenge)
      : [],
  };
}

function buildUniversalFallbackLessons(industry) {
  const ch = (scenario, question, hint) => [{ scenario, question, hint }];
  return [
    {
      title: "Effective Problem-Solving Strategies",
      description:
        "Practice structured approaches to analyze and solve complex challenges in any professional setting.",
      relevance:
        "Problem-solving is universally valuable across all industries and career paths.",
      challenges: ch(
        "You encounter a complex challenge or problem in your workplace that requires careful analysis and a strategic solution.",
        "Describe your step-by-step approach to understanding, analyzing, and solving this problem.",
        "Break the problem into smaller components, identify root causes, consider multiple perspectives, and evaluate potential solutions."
      ),
    },
    {
      title: "Professional Communication and Stakeholder Management",
      description:
        "Develop clear communication, active listening, and constructive relationships with colleagues, clients, and stakeholders.",
      relevance: `Strong communication builds trust and collaboration in ${industry}.`,
      challenges: ch(
        "You must communicate an important message to stakeholders with different perspectives, priorities, and communication styles.",
        "How would you tailor your approach so each stakeholder understands and engages with your message?",
        "Consider audience analysis, message framing, communication channels, and follow-up strategies."
      ),
    },
    {
      title: "Time Management and Prioritization",
      description:
        "Manage competing priorities, deadlines, and energy so critical work reliably ships without burnout.",
      relevance:
        "Efficient prioritization protects quality and credibility in fast-moving professional environments.",
      challenges: ch(
        "Multiple urgent projects overlap and resources are constrained.",
        "How would you prioritize, schedule, and communicate trade-offs?",
        "Weigh urgency vs. impact; break down work; negotiate scope; protect deep-focus time."
      ),
    },
    {
      title: "Leadership Influence and Coaching",
      description:
        "Guide others toward outcomes through clarity, feedback, delegation, and psychological safety.",
      relevance:
        "Influence skills multiply your impact regardless of formal authority or seniority.",
      challenges: ch(
        "A teammate misses commitments and morale on the initiative is dipping.",
        "How would you reset expectations and support sustainable improvement?",
        "Use curious questions, specific feedback, clear agreements, and follow-through."
      ),
    },
    {
      title: "Critical Thinking for Better Decisions",
      description:
        "Separate assumptions from evidence, weigh trade-offs, and surface risks before you commit.",
      relevance: `Evidence-based reasoning reduces costly mistakes and builds credibility in ${industry}.`,
      challenges: ch(
        "Leadership asks for a fast recommendation based on incomplete data.",
        "How would you frame what you know, what you infer, and what you still need to validate?",
        "List assumptions; identify missing data; propose a phased decision with risk controls."
      ),
    },
    {
      title: "Customer and Client Experience",
      description:
        "Design interactions that signal reliability, empathy, and responsiveness end to end.",
      relevance:
        "Great client experience creates retention, referrals, and brand strength.",
      challenges: ch(
        "A client escalation arrives after repeated delays.",
        "How would you stabilize the situation, own the narrative, and fix the underlying issue?",
        "Acknowledge impact; set timelines; coordinate internally; communicate proactively."
      ),
    },
    {
      title: "Collaboration Across Teams",
      description:
        "Align goals, rituals, and handoffs so multi-team initiatives stay coherent and accountable.",
      relevance:
        "Cross-functional work is the default—clarity beats heroics.",
      challenges: ch(
        "Multiple teams depend on shared milestones but accountability is muddy.",
        "How would you create shared definitions of done and a lightweight operating rhythm?",
        "Clarify owners, artifacts, checkpoints, dependencies, and decision rights."
      ),
    },
    {
      title: "Professional Ethics and Trust",
      description:
        "Navigate gray areas while protecting people, reputations, and compliance obligations.",
      relevance:
        "Ethical judgment prevents harm and reinforces long-term trust with peers and partners.",
      challenges: ch(
        "You uncover a discrepancy that pressures you toward a shortcuts-friendly path.",
        "What principles guide your actions, who do you notify, and what evidence do you document?",
        "Prefer transparency, escalate appropriately, minimize harm, and avoid unilateral secrecy."
      ),
    },
  ];
}

function lessonsFromSkills(skills) {
  return skills.slice(0, LESSON_TARGET_COUNT).map((skill) => ({
    title: `Strengthen Your ${skill} Skills`,
    description: `Deepen practical application of ${skill} across real professional situations.`,
    relevance: `${skill} compounds across industries when practiced deliberately.`,
    challenges: [
      {
        scenario: `You must apply ${skill} with ambiguous constraints and competing stakeholder needs.`,
        question: `Describe how you would use ${skill} to move the situation forward.`,
        hint: "Clarify outcomes, stakeholders, risks, metrics, and a concrete next-step plan.",
      },
    ],
  }));
}

/** Merge parsed lessons with fillers until LESSON_TARGET_COUNT (dedupe by title). */
function ensureLessonCount(lessons, fillers) {
  const out = [...lessons].map(normalizeLesson);
  const seen = new Set(out.map((l) => String(l.title).toLowerCase().trim()));
  for (const filler of fillers) {
    const t = String(filler.title).toLowerCase().trim();
    if (out.length >= LESSON_TARGET_COUNT) break;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(normalizeLesson(filler));
  }
  return out.slice(0, LESSON_TARGET_COUNT);
}

export async function generateLessons(user) {
  const VITE_OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  const { skills = [], careerAnswers = {} } = user || {};
  const industry = primaryIndustryLabel(careerAnswers);
  const fillers = buildUniversalFallbackLessons(industry);

  if (!VITE_OPENAI_API_KEY) {
    if (skills.length > 0) {
      return ensureLessonCount(lessonsFromSkills(skills), fillers);
    }
    return fillers.slice(0, LESSON_TARGET_COUNT);
  }

  try {
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 6144,
        messages: [
          {
            role: "system",
            content: `
You are a career learning platform that generates lessons for ALL industries and professions - not just technology or coding.

User Context:
- Skills focus: ${user.skills?.join(", ") || "none"}
- Career goals and interests: ${JSON.stringify(user.careerAnswers || [])}
- Resume status: ${user.resumeUploaded ? "Resume uploaded" : "No resume uploaded"}

CRITICAL INSTRUCTIONS:
1. Lessons must be UNIVERSAL and applicable to ANY field (healthcare, finance, education, marketing, design, hospitality, manufacturing, consulting, law, arts, etc.)
2. DO NOT assume the user is in tech/coding unless explicitly stated in their career goals or skills
3. Focus on transferable skills: communication, critical thinking, project management, negotiation, presentation, research, analysis, coaching, ethics, collaboration, etc.
4. If Skills lists names, ensure several lessons deepen those competencies with DISTINCT angles—not duplicates.
5. Make scenarios realistic for their indicated industry/profession when known

Task:
Generate EXACTLY ${LESSON_TARGET_COUNT} personalized learning lessons (${LESSON_TARGET_COUNT} objects in the JSON array—no fewer).
Each lesson must include:
- title (distinct from the other lessons)
- description (what the learner practices)
- relevance (why it matters)
- challenges: array of 2-3 objects, each with scenario, question, hint

Respond STRICTLY as a JSON array only—no markdown, no prose outside the array.
`,
          },
          {
            role: "user",
            content: `Return exactly ${LESSON_TARGET_COUNT} lessons. Each title must be unique. If Skills lists one competency, diversify subtopics covering that competency from multiple professional angles.`,
          },
        ],
      }),
    });

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      const msg = data?.error?.message || data?.error || aiResponse.statusText;
      console.error("SecureAI: OpenAI API error:", msg);
      throw new Error(typeof msg === "string" ? msg : "OpenAI request failed");
    }

    const rawContent = data.choices?.[0]?.message?.content || "";
    const parsed = parseJsonArrayFromContent(rawContent);

    if (!parsed || parsed.length === 0) {
      console.warn(
        "SecureAI: Empty or unparseable lesson JSON from model. Content preview:",
        rawContent.slice(0, 200)
      );
      throw new Error("Invalid or empty lesson JSON from model");
    }

    let normalizedList = parsed.map(normalizeLesson);
    const deduped = [];
    const seenTitles = new Set();
    for (const lesson of normalizedList) {
      const key = String(lesson.title).toLowerCase().trim();
      if (seenTitles.has(key)) continue;
      seenTitles.add(key);
      deduped.push(lesson);
    }
    normalizedList = deduped;

    if (normalizedList.length < LESSON_TARGET_COUNT) {
      normalizedList = ensureLessonCount(normalizedList, fillers);
    } else if (normalizedList.length > LESSON_TARGET_COUNT) {
      normalizedList = normalizedList.slice(0, LESSON_TARGET_COUNT);
    }

    return normalizedList;
  } catch (err) {
    console.error("SecureAI: Failed to fetch or parse AI response:", err);

    if (skills.length > 0) {
      return ensureLessonCount(lessonsFromSkills(skills), fillers);
    }

    return fillers.slice(0, LESSON_TARGET_COUNT);
  }
}
