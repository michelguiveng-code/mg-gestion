import React, { useState } from 'react';
import {
  X,
  Lock,
  Phone,
  User as UserIcon,
  ShieldCheck,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { User, UserRole, AppLanguage } from '../../types';
import { translations } from '../../utils/i18n';
import { authenticateUser, registerUser } from '../../utils/auth';

interface AuthModalProps {
  isOpen: boolean;
  language: AppLanguage;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  language,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const t = translations[language] || translations.fr;
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState('+509 3788-2940');
  const [fullName, setFullName] = useState('Jean-Marc Baptiste');
  const [role, setRole] = useState<UserRole>('BUYER');
  const [otpCode, setOtpCode] = useState('5090');
  const [password, setPassword] = useState('Demo123!');
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // 1: form, 2: OTP verification

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMessage('Numéro de téléphone obligatoir.');
      return;
    }
    if (isSignUp && !fullName.trim()) {
      setErrorMessage('Nom complet obligatoire.');
      return;
    }
    if (!isSignUp && !password.trim()) {
      setErrorMessage('Mot de passe obligatoire.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('Entrez le bon code OTP ou utilisez le code de test 5090.');
      return;
    }

    if (isSignUp) {
      const registered = registerUser({
        fullName,
        email: `${fullName.toLowerCase().replace(/\s+/g, '.') || 'utilisateur'}@mggestion.ht`,
        phone,
        city: 'Port-au-Prince',
        role,
        password,
      });

      if (!registered) {
        setErrorMessage('Compte déjà existant ou mot de passe invalide.');
        return;
      }

      onLoginSuccess({
        ...registered,
        password: undefined,
      } as User);
      onClose();
      return;
    }

    const user = authenticateUser(phone, password, role);
    if (!user) {
      setErrorMessage('Identifiant ou mot de passe incorrect.');
      return;
    }

    onLoginSuccess(user);
    onClose();
  };

  const handleQuickDemoLogin = (demoRole: UserRole) => {
    const roleMap: Record<UserRole, string> = {
      BUYER: 'jean.marc@example.ht',
      SELLER: 'contact@techayiti.ht',
      ADMIN: 'admin@mggestion.ht',
    };

    const demoUser = authenticateUser(roleMap[demoRole], 'Demo123!', demoRole);
    if (demoUser) {
      onLoginSuccess(demoUser);
      onClose();
      return;
    }

    setErrorMessage('Compte de démonstration inaccessible.');
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        id="auth-modal-panel"
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {isSignUp ? t.auth.signupTitle : t.auth.loginTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {isSignUp ? t.auth.signupSubtitle : t.auth.loginSubtitle}
            </p>
          </div>
          <button
            id="close-auth-btn"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Selector for fast inspection */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-2">
          <span className="text-[11px] font-bold uppercase text-[#0066FF] dark:text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Accès Démo 1-Clic :</span>
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('BUYER')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#0066FF] transition-all shadow-2xs"
            >
              Acheteur
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('SELLER')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#0066FF] transition-all shadow-2xs"
            >
              Vendeur Pro
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-red-500 transition-all shadow-2xs text-red-600"
            >
              Superadmin
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          Continuer en mode visiteur
        </button>

        {/* STEP 1: Phone & Role */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.auth.name} *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jean-Marc Baptiste"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.auth.password} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.auth.phone} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+509 3788-2940"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>
            </div>

            {/* Role picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Type de compte :
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                    role === 'BUYER'
                      ? 'border-[#0066FF] bg-blue-50/50 dark:bg-blue-950/40 text-[#0066FF]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <UserIcon className="w-4 h-4 shrink-0" />
                  <span>Acheteur</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('SELLER')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 ${
                    role === 'SELLER'
                      ? 'border-[#0066FF] bg-blue-50/50 dark:bg-blue-950/40 text-[#0066FF]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Building className="w-4 h-4 shrink-0" />
                  <span>Vendeur / Boutik</span>
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.auth.password} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Créez un mot de passe"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>
            )}

            {errorMessage && (
              <p className="text-[11px] font-medium text-red-600 dark:text-red-400">{errorMessage}</p>
            )}

            <button
              type="submit"
              id="auth-send-otp-btn"
              className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continuer par SMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndLogin} className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.auth.otpCode}
                </label>
                <span className="text-[10px] text-emerald-600 font-bold">
                  Code test : 5090
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="5090"
                className="w-full py-3 text-center text-lg font-mono font-black tracking-widest rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {errorMessage && (
              <p className="text-[11px] font-medium text-red-600 dark:text-red-400">{errorMessage}</p>
            )}

            <button
              type="submit"
              id="auth-verify-otp-btn"
              className="w-full py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              {t.auth.verifyOtp}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-slate-500 hover:underline"
            >
              Changer de numéro de téléphone
            </button>
          </form>
        )}

        {/* Toggle sign in / sign up */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setStep(1);
            }}
            className="text-[#0066FF] hover:underline font-semibold"
          >
            {isSignUp ? t.auth.hasAccount : t.auth.noAccount}
          </button>
        </div>
      </div>
    </div>
  );
};
