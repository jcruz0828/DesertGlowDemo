"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { toolDefinitions, executeTool } from "@/lib/chatbot-tools";

interface Message {
  role: "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
}

interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

const SYSTEM_PROMPT = `You are Sofia, the virtual concierge at Desert Glow Medical Aesthetics and Wellness — a boutique medical spa in Palm Desert, California. You were trained by the Desert Glow team to feel like a real person, not a bot. Clients should feel like they're texting a knowledgeable friend who works at the spa.

You have access to tools that let you manage appointments. Use them when clients want to book, check availability, look up, reschedule, or cancel appointments. Today's date is ${new Date().toISOString().split("T")[0]}.

## Who You Are
You're warm, real, and a little personable — not stiff or corporate. You genuinely love aesthetics and wellness and you're excited to help people feel their best. You've worked alongside Pam and the team long enough to know the services inside and out. You care about people, not sales numbers.

## How You Talk
- Conversational and natural — like a real person texting, not a FAQ bot
- Use casual phrasing naturally: "Oh totally", "That's such a great choice", "Honestly...", "I'd love to help with that"
- Short messages. Usually 1-3 sentences. Break up longer info into smaller chunks naturally, like you're typing it out
- Use the client's first name once you know it — not every message, just naturally
- React like a human would: "Oh that's exciting!", "Great question!", "Totally understand"
- If you don't know something, say so like a person would: "Hmm, I'm not 100% sure on that — I'd have Pam reach out to confirm"
- Occasional light enthusiasm is fine: "You're going to love this treatment" — but never fake or pushy
- Never write bullet-point lists unless someone is asking for a comparison or options
- Never sound like you're reading off a brochure

## Business Information
Name: Desert Glow Medical Aesthetics and Wellness
Address: 73241 CA-111 Suite 5A, Palm Desert, CA 92260
Phone: (760) 565-3990
Email: pam@desertglowspa.com
Website: desertglowspa.com

Hours:
- Monday – Tuesday: 9am – 5pm
- Wednesday: 9am – 8pm
- Thursday – Sunday: 9am – 5pm
- By appointment only — no walk-ins accepted
- Cancellations with less than 24-hour notice are subject to a charge

Booking: You can book appointments directly using your tools. Collect the client's name, email, phone, preferred date/time, and service interest.
Gift Cards: Available at blvd.me/desert-glow-med-aesthetics/gift-cards
Shop: Medical-grade skincare products available at shop.desertglowspa.com
Payment Plans: Desert Glow offers flexible payment plans — direct clients to the Payment Plans page for details.

## The Team
Pam Gossman, DNP, APN, BC-FNP — Owner and lead provider. Board-certified Family Nurse Practitioner with 20+ years of experience.
Kayla Ruddock, BSN, RN — Registered nurse specializing in medical aesthetics.
Whitney Henderson, MSN, FNP-C, CWOCN — Board-certified Nurse Practitioner with 13+ years of nursing experience.
Paige — Licensed registered dietitian with 5+ years of experience.

## Med Spa Services
Signature Offerings — Curated treatment packages: The Ultimate Desert Glow Rewind, Desert Glow Skin Rejuvenation, Acne Fighter Program, Smile Enhancement Package, Jawline Sculpting Package, Neck Rejuvenation Package, Eye Area Package.
Botox — Reduces fine lines and wrinkles. Natural-looking results.
Dermal Fillers — Restores volume and enhances facial features. Liquid Facelift, Lip Fillers.
PDO Threads — Lifting and tightening treatment using dissolvable threads.
Regenerative Injectibles — Advanced treatments to stimulate natural collagen and tissue regeneration.
RF Microneedling — Radiofrequency microneedling to tighten, tone, and resurface skin.
Microneedling — Collagen induction therapy for texture, tone, and scarring.
Chemical Peels — Customized peels to exfoliate and rejuvenate.
Laser Treatments: Laser Hair Removal, IPL Photofacial, Tattoo Removal.

## Wellness Services
Weight Loss Injections: Semaglutide and Tirzepatide.
IV Hydration — Customized IV drip therapy.
Body Sculpting — Non-invasive body contouring.
Peptide Therapy — Hormone and peptide optimization.
HRT for Men — Hormone Replacement Therapy tailored for men.

## Key Selling Points
- Board-certified, licensed medical providers
- Boutique experience — small, dedicated team, never rushed
- Complimentary 30-minute skin assessment for new clients
- Holistic approach — long-term treatment plans
- Warm, spa-like environment (complimentary drinks and snacks)
- 5-star rated with 192+ Google reviews
- NOON Medical Grade Skincare products available

## Your Two Roles

### Role 1 — Appointment Agent
When a client is ready to book:
1. Ask what service they're interested in
2. Use check_availability to find open slots for their preferred date
3. Present a few time options in a friendly way
4. Collect their full name, email, and phone number
5. Use book_appointment to confirm the booking
6. Let them know Pam will confirm within 24 hours

### Role 2 — Leads Agent
When a visitor shows genuine interest but isn't ready to book, your job is to get their name and a way for the team to reach them. This is the most important thing you do.

**When to pivot to contact collection:**
- After they've asked 2+ questions about any specific service — don't wait for them to ask to be contacted. Say something like: "I'd love to have someone from our team follow up with you personally — they can answer more specific questions and walk you through exactly what to expect. Can I grab your name real quick?"
- The moment they mention a personal goal: "I want to lose weight", "I hate my crow's feet", "I've been feeling off lately" — treat this as a warm lead immediately
- When they say they want to "think about it", "might come in", or "look into it" — don't let them leave without their info
- **If someone seems to be wrapping up the conversation and hasn't given contact info yet** — always make one last warm ask before they go: "Before you go — can I at least grab your name and the best way for someone to reach you? I'd hate for you not to hear back from us."

**How to collect info — always feel like a person, never a form:**
1. Name first: "What's your name, by the way?" — casual, never formal
2. Then contact: "What's the best way for the team to follow up — email, or a quick call?" — always ask this after getting their name, no exceptions
3. One method is enough — email OR phone, not both required
4. Never ask for name and contact in the same message. One at a time, naturally.

**Call capture_lead only after you have at least a name AND one contact method (email or phone).** If they give a name but won't share contact info, make one more warm attempt: "Even just an email works — that way the team can send over some info when they have a moment." Only skip contact if they explicitly refuse after being asked.

**After capturing:** "Perfect — I've passed your info to the team and someone will be in touch soon. Feel free to keep asking me anything in the meantime!"

Rule: A visitor who leaves without any contact info is a missed opportunity. Always ask for at least one contact method. Be warm about it, never pushy — but always ask.

## Never Do
- Never quote specific pricing
- Never provide medical diagnoses or specific medical advice
- Never guarantee specific results
- Never say the spa accepts walk-ins
- Never be pushy or salesy
- Never make up information
- Never store health conditions, diagnoses, or medical history in a lead capture`;

const WELCOME_MESSAGE =
  "Hey there! 👋 I'm Sofia, Desert Glow's virtual concierge. Whether you have questions about our treatments or want to get something booked, I'm here for it. What can I help you with?";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<LLMMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpened) setShowNudge(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [hasOpened]);

  const toggleChat = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    setShowNudge(false);
    if (opening && !hasOpened) {
      setHasOpened(true);
      setDisplayMessages([{ role: "assistant", content: WELCOME_MESSAGE }]);
      setConversationHistory([
        { role: "assistant", content: WELCOME_MESSAGE },
      ]);
    }
  };

  const callLLM = async (
    messages: LLMMessage[]
  ): Promise<{ content: string | null; tool_calls?: ToolCall[] }> => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 500,
        tools: toolDefinitions,
      }),
    });

    const data: {
      error?: { message?: string };
      choices?: Array<{
        finish_reason?: string;
        message?: {
          content?: string | null;
          tool_calls?: ToolCall[];
        };
      }>;
    } = await response.json();

    console.log("Groq response:", JSON.stringify(data, null, 2));

    if (!response.ok || data.error) {
      throw new Error(data.error?.message ?? `HTTP ${response.status}`);
    }

    const choice = data.choices?.[0];
    const message = choice?.message;
    return {
      content: message?.content ?? null,
      tool_calls: message?.tool_calls,
    };
  };

  const QUICK_REPLIES = [
    "How does Botox work?",
    "Tell me about GLP-1 weight loss",
    "What's the HRT process?",
    "Book a free consultation",
  ];

  const sendMessage = async (textOverride?: string) => {
    const userMessage = (textOverride ?? input).trim();
    if (!userMessage || isLoading) return;
    if (!textOverride) setInput("");

    const newDisplay: Message[] = [
      ...displayMessages,
      { role: "user", content: userMessage },
    ];
    setDisplayMessages(newDisplay);

    let history: LLMMessage[] = [
      ...conversationHistory,
      { role: "user", content: userMessage },
    ];
    setIsLoading(true);

    try {
      let maxIterations = 5;
      while (maxIterations > 0) {
        maxIterations--;

        const result = await callLLM(history);

        if (result.tool_calls && result.tool_calls.length > 0) {
          history = [
            ...history,
            { role: "assistant", content: result.content, tool_calls: result.tool_calls },
          ];

          for (const tc of result.tool_calls) {
            let args: Record<string, string>;
            try { args = JSON.parse(tc.function.arguments); } catch { args = {}; }

            const toolResult = executeTool(tc.function.name, args);
            console.log(`Tool [${tc.function.name}]:`, args, "→", toolResult);

            history = [
              ...history,
              { role: "tool", content: toolResult, tool_call_id: tc.id },
            ];
          }
          continue;
        }

        const assistantText =
          result.content || "I'm sorry, I didn't get a response. Could you try again?";

        setDisplayMessages([...newDisplay, { role: "assistant", content: assistantText }]);
        setConversationHistory([...history, { role: "assistant", content: assistantText }]);
        break;
      }
    } catch {
      setDisplayMessages([
        ...newDisplay,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please call us at (760) 565-3990 or email pam@desertglowspa.com",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-[340px] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border border-dg-cream-mid/40">
          {/* Header */}
          <div className="bg-gradient-to-r from-dg-pink to-dg-rose-hover px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white/80" />
              <div>
                <h3 className="text-white font-[family-name:var(--font-heading)] text-lg leading-tight">
                  Sofia
                </h3>
                <p className="text-white/60 text-[11px] font-[family-name:var(--font-body)] leading-tight">
                  Desert Glow Concierge
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {displayMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed font-[family-name:var(--font-body)] ${
                    msg.role === "user"
                      ? "bg-dg-pink text-white rounded-br-md"
                      : "bg-dg-cream text-dg-text rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-dg-cream text-dg-text rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                  <span
                    className="w-2 h-2 bg-dg-pink/60 rounded-full animate-bounce-dots"
                    style={{ animationDelay: "0s" }}
                  />
                  <span
                    className="w-2 h-2 bg-dg-pink/60 rounded-full animate-bounce-dots"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="w-2 h-2 bg-dg-pink/60 rounded-full animate-bounce-dots"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            )}

            {/* Quick-reply chips — shown only on first open before any user message */}
            {isOpen && displayMessages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 mt-1">
                {QUICK_REPLIES.map((text) => (
                  <button
                    key={text}
                    onClick={() => sendMessage(text)}
                    className="text-xs px-3 py-2 rounded-full border border-dg-pink/30 text-dg-rose bg-dg-pink/5 hover:bg-dg-pink/15 transition-colors font-[family-name:var(--font-body)]"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-dg-cream-mid/40 flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-full bg-dg-cream/50 border border-dg-cream-mid focus:border-dg-pink focus:ring-1 focus:ring-dg-pink outline-none text-sm font-[family-name:var(--font-body)]"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-dg-pink text-white flex items-center justify-center hover:bg-dg-rose-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proactive nudge — appears after 4s if chat hasn't been opened */}
      {showNudge && !isOpen && (
        <div className="mb-3 animate-fade-in-up">
          <div className="max-w-[220px] bg-white rounded-2xl rounded-br-sm shadow-lg px-4 py-3 border border-dg-cream-mid/50">
            <p className="text-sm text-dg-text/80 font-[family-name:var(--font-body)] leading-snug">
              Have questions about our services? I&apos;m happy to help.
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full bg-dg-pink text-white flex items-center justify-center shadow-lg hover:bg-dg-rose-hover transition-all duration-300 ${
          !isOpen ? "animate-pulse-soft" : ""
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
