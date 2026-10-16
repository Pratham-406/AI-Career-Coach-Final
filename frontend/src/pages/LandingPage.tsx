import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GitBranch, BrainCircuit, Search, ArrowRight, CheckCircle2, Code2, LineChart, FileCode2 } from 'lucide-react';

/** Marketing preview only; the existing application pages retain their API-backed flows. */
export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useAuth();
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-container hero-grid">
          <div>
            <p className="eyebrow inline-flex items-center gap-2"><GitBranch size={18} /> Evidence from your repositories</p>
            <h1>Know what your code proves.</h1>
            <p className="hero-description">Compare your GitHub projects with job requirements, identify evidence gaps, and track how your portfolio improves.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => setCurrentPage('dashboard')}>Launch Student Dashboard <ArrowRight size={19} /></button>
              <button className="btn-secondary" onClick={() => setCurrentPage('repositories')}>Inspect Analyzed Repos</button>
            </div>
            <p className="hero-note">Explore the existing demo portfolio. Repository analysis and job matching are simulated in this edition.</p>
          </div>
          <div className="portfolio-preview">
            <div className="preview-header"><div><h2>Portfolio assessment</h2><p>Illustrative product preview</p></div><span className="demo-badge">Demo</span></div>
            <div className="preview-body">
              <div className="preview-repo"><span className="section-label">Repository</span><h3><GitBranch size={20} /> eventflow-distributed-queue</h3><div className="preview-selection">Code evidence</div><p>TypeScript</p><p>Containers</p><p>Testing</p></div>
              <div className="preview-evidence"><div className="flex flex-wrap justify-between gap-3 items-center"><h3>Architecture</h3><span className="evidence-badge">Sample evidence</span></div><p>Inspect the implementation behind each assessment and understand what still needs work.</p><div className="code-file"><h4><FileCode2 size={19} /> Dockerfile & Redis queue</h4><code>Multi-stage build<br />Redis pub/sub queue</code><p>Example from the existing demo dataset</p></div></div>
            </div>
            <button className="preview-link" onClick={() => setCurrentPage('skill-gap')}>Inspect Complete Skill Gap Analysis <ArrowRight size={17} /></button>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="landing-section surface-white">
        <div className="landing-container"><p className="eyebrow">How it works</p><h2>From repository to career direction</h2>
          <div className="steps-grid">
            <article><span>01</span><h3>Connect selected work</h3><p>Choose the repositories that best represent your current skills.</p></article>
            <article><span>02</span><h3>Inspect the evidence</h3><p>Review assessed skills, implementation insights, and gaps in your portfolio.</p></article>
            <article><span>03</span><h3>Compare and improve</h3><p>Review job requirements, evidence gaps, and practical next steps.</p></article>
          </div>
        </div>
      </section>
      <section id="evidence" className="landing-section"><div className="landing-container evidence-grid"><div><p className="eyebrow">Verifiable evidence</p><h2>An assessment you can inspect</h2><p className="section-description">Detected dependencies are clues, not proof. Explore the code insights behind your assessment and see which skills need stronger evidence.</p><ul className="evidence-list">{['Repository-level implementation insights','Assessment history for tracking progress','Clear demo and scope labels'].map(item=><li key={item}><CheckCircle2 size={22}/>{item}</li>)}</ul></div><div className="evidence-example"><div><span className="evidence-badge">Illustrative assessment</span><h3>Codebase implementation</h3></div><pre><code><span>// Existing demo portfolio</span>{'\nMulti-stage Dockerfile\nRedis pub/sub queue\n\n'}<span>// Identified evidence gap</span>{'\nMissing Kubernetes manifests'}</code></pre><p>eventflow-distributed-queue · Simulated analysis</p></div></div></section>
      <section id="capabilities" className="landing-section surface-white"><div className="landing-container"><p className="eyebrow">Capabilities</p><h2>A clearer picture of your next step</h2><div className="capabilities-grid">{[
        {icon:Code2,title:'AST & Codebase Audit',text:'Explore repository architecture, typing, containers, and test coverage in the demo assessment.'},
        {icon:BrainCircuit,title:'Evidence-Backed Gaps',text:'Compare demonstrated skills with target-role requirements and practical recommendations.'},
        {icon:Search,title:'Job Match Scoring',text:'Review matching and missing requirements alongside relevant jobs and internships.'},
        {icon:LineChart,title:'Progress Over Time',text:'Track assessments and see how your portfolio readiness changes.'}
      ].map(({icon:Icon,title,text})=><article key={title}><Icon size={25}/><h3>{title}</h3><p>{text}</p></article>)}</div><div className="landing-cta"><div><p className="eyebrow">Your next chapter</p><h2>Ready to evaluate your portfolio?</h2><p>Start with the interactive demo dashboard and its representative repositories.</p></div><div className="hero-actions"><button className="btn-primary" onClick={()=>setCurrentPage('dashboard')}>Explore Student Dashboard <ArrowRight size={18}/></button><button className="btn-secondary" onClick={()=>setCurrentPage('pricing')}>View Pricing Plans</button></div></div></div></section>
    </div>
  );
};
