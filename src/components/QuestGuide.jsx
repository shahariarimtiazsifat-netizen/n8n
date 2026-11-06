import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight, Check, CheckCircle2, ChevronDown, ChevronRight,
  Code2, Crown, ExternalLink, Lightbulb, Link2, Lock, Sparkles, Target,
  Trophy, Zap,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Mini progress bar shown inside the steps card
───────────────────────────────────────────── */
function StepBar({ done, total }) {
  const pct = total ? (done / total) * 100 : 0;
  return (
    <div className="qg-stepbar-wrap">
      <div className="qg-stepbar-track">
        <motion.div
          className="qg-stepbar-fill"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
      <span className="qg-stepbar-label">{done}/{total} steps done</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Single interactive mission step checkbox
───────────────────────────────────────────── */
function MissionStep({ index, text, checked, disabled, onToggle, petCheer }) {
  const handleChange = () => {
    if (disabled) return;
    onToggle(index);
    if (!checked && petCheer) petCheer();
  };
  return (
    <motion.label
      className={`qg-step-row ${checked ? 'qg-step-done' : ''} ${disabled ? 'qg-step-disabled' : ''}`}
      htmlFor={`mission-step-${index}`}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      layout
    >
      <input
        id={`mission-step-${index}`}
        className="qg-step-checkbox"
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className="qg-step-num">Step {index + 1}</span>
      <span className="qg-step-text">{text}</span>
    </motion.label>
  );
}

/* ─────────────────────────────────────────────
   JSON Vault (Workflow backup)
───────────────────────────────────────────── */
function JsonVault({ value, onChange, downloadName = 'n8n-workflow.json' }) {
  const input = useRef(null);
  const read = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => onChange(String(r.result || ''));
    r.readAsText(f);
    e.target.value = '';
  };
  const save = () => {
    if (!value) return;
    const b = new Blob([value], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = downloadName;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="json-vault">
      <div className="vault-actions">
        <button type="button" onClick={() => input.current?.click()}>↑ Upload .json</button>
        <button type="button" onClick={save} disabled={!value}>↓ Download backup</button>
        <input ref={input} hidden type="file" accept=".json,application/json" onChange={read} />
      </div>
      <textarea
        className="workflow-input"
        aria-label="Workflow JSON backup"
        placeholder="Paste workflow JSON or upload an exported .json file…"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Curated beginner tips for Days 1 to 21
───────────────────────────────────────────── */
const beginnerTips = {
  1: 'Pin down the item shape first: inspect the trigger output, then reference fields with expressions like {{$json.name}}. Run each node once so you can see the data it passes forward.',
  2: 'Split the order array, filter out-of-stock products, then route VIP orders with Number($json.total) > 5000. Aggregate the surviving items after routing.',
  3: 'Use $input.all().map(({json}) => ({json: {...json, phone: "+880" + json.phone.replace(/\\D/g, "").replace(/^880/, ""), margin: Number(json.price) - Number(json.cost) - Number(json.discount||0)}})). Return each result as a {json} item.',
  4: 'For a synchronous form response, set the Webhook to “Using Respond to Webhook node”. Return a small JSON body and test the production URL only after activating the workflow.',
  5: 'Keep tokens in n8n Credentials. Set Authorization to Bearer <token>, inspect the response status, then map only the fields your next node needs.',
  6: 'Give the agent a narrow role, explicit boundaries, and a clear fallback. Ask it to return a concise answer when a tool is not needed.',
  7: 'Use a Text Classifier to label each message Sales, Support, or Refund, then route to a dedicated prompt chain. Add sentiment as a second routing signal.',
  8: 'Use a stable per-user sessionId (phone or account ID), not the execution ID, so separate messages retrieve the same memory.',
  9: 'Define required keys, types, and allowed enum values in the schema. Validate the parsed output before any action node runs.',
  10: 'Give the Agent Calendar, Sheets, and Gmail tools with clear descriptions. Check availability first, then book, log the lead, and send a confirmation.',
  11: 'Give each sub-agent a constrained input/output contract. Return structured JSON to the manager so it can route the result predictably.',
  12: 'Use Recursive Character Text Splitter, add document ID/page/source metadata before embedding, and test retrieval with representative questions.',
  13: 'Keep the source document ID on every vector. On file change, delete vectors for that ID before inserting the newly embedded chunks.',
  14: 'Require citations from retrieved metadata and have the agent say when the retrieved context does not contain an answer.',
  15: 'Route stock questions to a live SQL/table tool and policy questions to vector search; do not let the model guess inventory.',
  16: 'Branch on MIME type first. Transcribe audio into text, preserve the original binary, and then join at a deliberate point.',
  17: 'Include execution URL, workflow name, and failed node in the alert. Keep credentials and customer payloads out of chat notifications.',
  18: 'Set Loop Over Items to batch 10 of 100, then place a controlled Wait on the loop path and inspect API headers for 429 responses.',
  19: 'Verify webhook challenge and signature, then test with a dedicated test number and a short allow-listed flow.',
  20: 'Require Header Auth on public webhooks, add prompt-injection defenses before tool calls, and export an account-independent JSON backup of each modular workflow.',
  21: 'Record the business problem first, show one live happy path, and finish on the readable workflow canvas.'
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function QuestGuide({
  day,
  completedSteps,        // boolean[] length 4
  onToggleStep,          // (idx: number) => void
  onMarkAllSteps,        // () => void (marks all 4 steps at once)
  isDayCompleted,        // boolean
  isDayUnlocked = true,  // boolean
  isNextUnlocked = true, // boolean
  onCompleteDay,         // () => void
  notes,
  onChangeNotes,
  demoUrl,
  onChangeDemoUrl,
  workflowJson,
  onChangeWorkflowJson,
  onPrevDay,
  onNextDay,
  petCheer,              // optional callback to trigger N8ny cheer
  onLockedNext,
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const isBoss = day.isBoss ?? day.boss;
  const missionSteps = Array.isArray(day.steps) && day.steps.length
    ? day.steps
    : Array.isArray(day.missionSteps) && day.missionSteps.length
      ? day.missionSteps
      : Array.isArray(day.missions) && day.missions.length
        ? day.missions
        : [
            'Open your n8n Cloud workspace and create a new workflow.',
            'Add your trigger and connect the required node.',
            'Configure node parameters and test execution.',
            'Verify the output data on the right canvas panel.',
          ];

  // Derive step completion count
  const stepsChecked = (completedSteps || []).filter(Boolean).length;
  const totalSteps = missionSteps.length;
  const allChecked = stepsChecked >= totalSteps;

  // "Mark all done" quick shortcut
  const markAllDone = () => {
    if (!isDayUnlocked) return;
    if (onMarkAllSteps) {
      onMarkAllSteps();
    } else {
      missionSteps.forEach((_, i) => {
        if (!completedSteps[i]) onToggleStep(i);
      });
    }
  };

  /* XP label */
  const xpLabel = isBoss ? '+350 XP' : '+100 XP';

  return (
    <div className="qg-root">

      {/* ── LOCKED BANNER (if navigated to a locked day) ── */}
      {!isDayUnlocked && (
        <div className="qg-locked-level-alert">
          <Lock size={15} />
          <div>
            <strong>Level {day.day} is Locked</strong>
            <p>Complete Level {day.day - 1} or activate God Mode in the header to unlock this quest!</p>
          </div>
        </div>
      )}

      {/* ── HEADER ─────────────────────────────────── */}
      <div className="qg-header">
        <div className="qg-header-left">
          <span className="qg-world-badge">
            WORLD {day.phase} &nbsp;·&nbsp; LEVEL {String(day.day).padStart(2, '0')}
          </span>
          {isBoss ? (
            <span className="qg-boss-badge">
              <Crown size={13} />
              BOSS QUEST &nbsp;+350 XP
            </span>
          ) : (
            <span className="qg-xp-badge">
              <Zap size={12} />
              {xpLabel}
            </span>
          )}
        </div>

        {isDayCompleted && (
          <span className="qg-completed-chip">
            <CheckCircle2 size={13} />
            COMPLETED
          </span>
        )}
      </div>

      {/* ── DAY TITLE ──────────────────────────────── */}
      <h2 className="qg-title">{day.title}</h2>

      {/* ══════════════════════════════════════════════
          CARD 1 — ELI5 Core Concept & Why Clients Pay
      ══════════════════════════════════════════════ */}
      <div className="qg-card qg-card-eli5">
        <div className="qg-card-label">
          <span className="qg-label-icon qg-icon-yellow">
            <Lightbulb size={14} />
          </span>
          💡 EXPLAIN LIKE I'M 5 — THE CORE CONCEPT
        </div>
        <p className="qg-eli5-text">
          {day.coreConcept || 'No concept summary available yet.'}
        </p>

        <div className="qg-card-label qg-label-gap">
          <span className="qg-label-icon qg-icon-yellow">💰</span>
          WHY BUSINESSES PAY FOR THIS
        </div>
        <p className="qg-why-pay-text">
          {day.whyItPays || (
            day.phase === 1
              ? 'Manual data entry wastes hundreds of hours and causes shipping delays. Businesses eagerly pay ৳25,000–৳50,000 to automate their order routing, webhooks, and core data plumbing.'
              : day.phase === 2
              ? 'Hiring 24/7 human staff to answer repetitive client questions is expensive. AI agents qualify leads, book calendar slots, and answer FAQs automatically around the clock.'
              : day.phase === 3
              ? 'Companies have hundreds of internal policy PDFs and catalogs. Grounded RAG assistants answer from actual company files with zero hallucinations.'
              : 'Production engineering, webhook authentication, rate limit protection, and error alerts turn fragile scripts into enterprise systems that command monthly retainers.'
          )}
        </p>

        <div className="qg-card-label qg-label-gap">
          <span className="qg-label-icon qg-icon-green">
            <Target size={14} />
          </span>
          YOUR DELIVERABLE TODAY
        </div>
        <div className="qg-deliverable-box">{day.deliverable}</div>
      </div>

      {/* ══════════════════════════════════════════════
          CARD 2 — Watch & Learn
      ══════════════════════════════════════════════ */}
      <div className="qg-card qg-card-watch">
        <div className="qg-card-label">
          <span className="qg-label-icon qg-icon-purple">🎬</span>
          STEP 1 — WATCH &amp; LEARN FIRST
        </div>
        <div className="qg-watch-inner">
          <p className="qg-watch-hint">
            Before building, understand what you're building. Watch or read this resource and pay attention to <strong>how data moves between nodes</strong>.
          </p>
          <div className="qg-watch-resource-card">
            <div className="qg-watch-resource-copy">
              <p>Resource</p>
              <span>{day.sourceName || day.tutorialTitle || 'Official Guide'}</span>
            </div>
            <a
              className="qg-watch-btn"
              href={day.sourceUrl || day.tutorialUrl || day.sourceUrlOrQuery || 'https://learn.n8n.io'}
              target="_blank"
              rel="noreferrer"
            >
              Watch &amp; Learn <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CARD 3 — Click-by-Click Mission Steps
      ══════════════════════════════════════════════ */}
      <div className="qg-card qg-card-steps">
        <div className="qg-card-label qg-label-row">
          <span>
            <span className="qg-label-icon qg-icon-blue">🛠️</span>
            STEP 2 — CLICK-BY-CLICK MISSION
          </span>
          {!allChecked && isDayUnlocked && (
            <button className="qg-mark-all" onClick={markAllDone}>
              Mark all done <ChevronRight size={11} />
            </button>
          )}
        </div>

        <StepBar done={stepsChecked} total={totalSteps} />

        <div className="qg-steps-list">
          {missionSteps.map((stepText, i) => (
            <MissionStep
              key={i}
              index={i}
              text={stepText}
              checked={!!(completedSteps && completedSteps[i])}
              disabled={!isDayUnlocked}
              onToggle={onToggleStep}
              petCheer={petCheer}
            />
          ))}
        </div>

        {/* All steps done celebration micro-banner */}
        <AnimatePresence>
          {allChecked && !isDayCompleted && isDayUnlocked && (
            <motion.div
              className="qg-steps-done-banner"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles size={14} />
              All steps complete — unlock the next level below!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════
          CARD 4 — Beginner Hint (collapsible)
      ══════════════════════════════════════════════ */}
      <div className="qg-card qg-card-hint">
        <button
          className="qg-hint-toggle"
          onClick={() => setHintOpen(o => !o)}
          aria-expanded={hintOpen}
        >
          <span className="qg-hint-toggle-left">
            <span className="qg-label-icon qg-icon-orange">🆘</span>
            <span>Stuck? Click for the #1 Beginner Tip</span>
          </span>
          <motion.span
            animate={{ rotate: hintOpen ? 180 : 0 }}
            transition={{ duration: 0.22 }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>

        <AnimatePresence>
          {hintOpen && (
            <motion.div
              className="qg-hint-body"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="qg-hint-content">
                <p className="qg-hint-text">
                  <strong>#1 Pro Tip for Day {day.day}:</strong>{' '}
                  {day.beginnerTip || beginnerTips[day.day] || (
                    day.deliverable
                      ? `Always click "Test step" after adding a node so you can inspect the exact JSON output. If your workflow isn't passing data, verify the previous node's output schema.`
                      : 'Always test each node individually before connecting to the next one. Use the "Test step" button after every new node you add.'
                  )}
                </p>
                <p className="qg-hint-subtext">
                  💡 Pro tip: Right-click any node → "Copy" → paste into a fresh workflow to debug it in isolation.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══════════════════════════════════════════════
          CARD 5 — NOTES, DEMO URL & WORKFLOW JSON VAULT
      ══════════════════════════════════════════════ */}
      <div className="qg-card qg-card-notes">
        <div className="qg-card-label">
          <span className="qg-label-icon qg-icon-blue">
            <Lightbulb size={14} />
          </span>
          YOUR NOTES &amp; LEARNINGS
        </div>
        <textarea
          className="qg-notes-area"
          placeholder="What clicked today? What was tricky? What do you want to revisit?"
          value={notes || ''}
          onChange={e => onChangeNotes(e.target.value)}
        />

        <div className="qg-card-label qg-label-gap">
          <span className="qg-label-icon qg-icon-purple">
            <Link2 size={14} />
          </span>
          DEMO VIDEO URL
          <span className="qg-optional-tag">OPTIONAL</span>
        </div>
        <div className="qg-demo-field">
          <Link2 size={13} />
          <input
            type="url"
            placeholder="Paste your Loom or YouTube demo link"
            value={demoUrl || ''}
            onChange={e => onChangeDemoUrl(e.target.value)}
          />
          {demoUrl && (
            <a href={demoUrl} target="_blank" rel="noreferrer">
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>

        <div className="qg-card-label qg-label-gap">
          <span className="qg-label-icon qg-icon-green">
            <Code2 size={14} />
          </span>
          WORKFLOW JSON BACKUP
        </div>
        <JsonVault
          value={workflowJson || ''}
          onChange={onChangeWorkflowJson}
          downloadName={`day-${day.day}-workflow.json`}
        />
      </div>

      {/* ══════════════════════════════════════════════
          COMPLETE LEVEL BUTTON (gated on all steps & unlock)
      ══════════════════════════════════════════════ */}
      <div className="qg-complete-section">
        {isDayCompleted ? (
          <div className="qg-already-done">
            <CheckCircle2 size={18} />
            <div>
              <strong>Level {day.day} Complete!</strong>
              <span>+{isBoss ? 350 : 100} XP earned</span>
            </div>
          </div>
        ) : (
          <>
            <motion.button
              className={`qg-complete-btn ${allChecked && isDayUnlocked ? 'qg-complete-btn-ready' : 'qg-complete-btn-locked'}`}
              onClick={allChecked && isDayUnlocked ? onCompleteDay : undefined}
              disabled={!allChecked || !isDayUnlocked}
              animate={allChecked && isDayUnlocked ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              whileTap={allChecked && isDayUnlocked ? { scale: 0.97 } : {}}
              title={
                !isDayUnlocked
                  ? `Level ${day.day} is locked!`
                  : !allChecked
                  ? 'Complete all 4 mission steps first!'
                  : ''
              }
            >
              <Trophy size={17} />
              {!isDayUnlocked
                ? `Level ${day.day} is Locked (Complete Level ${day.day - 1} First)`
                : allChecked
                ? `🏆 Complete Level & Unlock Day ${day.day + 1 <= 21 ? day.day + 1 : '🎉'}`
                : `Complete all ${totalSteps} steps to unlock (${stepsChecked}/${totalSteps})`}
              {allChecked && isDayUnlocked && (
                <span className="qg-complete-xp">
                  +{isBoss ? 350 : 100} XP
                </span>
              )}
            </motion.button>

            {isDayUnlocked && !allChecked && (
              <p className="qg-locked-hint">
                Tick all mission steps above to light up this button ✨
              </p>
            )}
          </>
        )}
      </div>

      {/* ── DAY NAV ──────────────────────────────────── */}
      <div className="qg-day-nav">
        <button
          className="qg-nav-btn"
          disabled={day.day <= 1}
          onClick={onPrevDay}
        >
          ← Previous Day
        </button>
        <span className="qg-nav-counter">{day.day} / 21</span>
        <button
          className="qg-nav-btn"
          disabled={day.day >= 21}
          onClick={isNextUnlocked ? onNextDay : onLockedNext}
          title={!isNextUnlocked ? `Complete Level ${day.day} to unlock Day ${day.day + 1}` : ''}
        >
          {isNextUnlocked ? 'Next Day →' : `Day ${day.day + 1} 🔒`}
        </button>
      </div>
    </div>
  );
}
