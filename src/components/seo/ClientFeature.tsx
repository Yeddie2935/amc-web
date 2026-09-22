import { Component, useEffect, useState, type ComponentType, type ReactNode } from "react";

class FeatureBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert">The interactive activity could not load. The explanation is still available. <button onClick={() => window.location.reload()}>Reload activity</button></p> : this.props.children; }
}

export function ClientFeature({ load, label = "interactive activity" }: { load: () => Promise<{ default: ComponentType }>; label?: string }) {
  const [Feature, setFeature] = useState<ComponentType | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    load().then(module => { if (active) setFeature(() => module.default); }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [load, attempt]);
  if (failed) return <p role="alert">Unable to load the {label}. <button onClick={() => { setFailed(false); setAttempt(a => a+1); }}>Try again</button></p>;
  return Feature ? <FeatureBoundary><Feature /></FeatureBoundary> : <p className="fmj-feature-placeholder" role="status">Loading {label}… <noscript>Enable JavaScript to use the activity. The written content and links work without it.</noscript></p>;
}
