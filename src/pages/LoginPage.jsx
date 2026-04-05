// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { useAuth } from "../context/AuthContext";
// import { authAPI } from "../services/api";
// import toast from "react-hot-toast";

// export default function LoginPage() {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const res = await authAPI.login(data);
//       login(res.data.user, res.data.token);
//       toast.success(`Welcome back, ${res.data.user.name}!`);
//       navigate("/dashboard");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
//       {/* Background grid */}
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

//       <div className="relative w-full max-w-sm animate-fade-in">
//         {/* Glow */}
//         <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent-blue/20 rounded-full blur-3xl pointer-events-none" />

//         {/* Card */}
//         <div className="card p-8 space-y-6">
//           {/* Header */}
//           <div className="text-center space-y-2">
//             <div className="w-12 h-12 rounded-2xl bg-accent-blue mx-auto flex items-center justify-center mb-4">
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="white"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <rect x="2" y="7" width="20" height="14" rx="2" />
//                 <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-semibold text-white">FinanceOS</h1>
//             <p className="text-gray-500 text-sm">Sign in to your dashboard</p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <label className="label">Email</label>
//               <input
//                 type="email"
//                 placeholder="you@example.com"
//                 className="input-field"
//                 {...register("email", { required: "Email is required" })}
//               />
//               {errors.email && (
//                 <p className="text-red-400 text-xs mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="label">Password</label>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 className="input-field"
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: { value: 6, message: "Min 6 characters" },
//                 })}
//               />
//               {errors.password && (
//                 <p className="text-red-400 text-xs mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-accent-blue hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 mt-2"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <Spinner /> Signing in...
//                 </span>
//               ) : (
//                 "Sign in"
//               )}
//             </button>
//           </form>

//           {/* Demo credentials */}
//           <div className="border border-bg-border rounded-xl p-3 space-y-1.5">
//             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
//               Demo accounts
//             </p>
//             <DemoRow role="Admin" email="admin@demo.com" />
//             <DemoRow role="Analyst" email="analyst@demo.com" />
//             <DemoRow role="Viewer" email="viewer@demo.com" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function DemoRow({ role, email }) {
//   const colors = {
//     Admin: "badge-purple",
//     Analyst: "badge-blue",
//     Viewer: "badge-amber",
//   };
//   return (
//     <div className="flex items-center justify-between">
//       <span className={colors[role]}>{role}</span>
//       <span className="text-gray-500 text-xs font-mono">{email} / pass123</span>
//     </div>
//   );
// }

// function Spinner() {
//   return (
//     <svg
//       className="animate-spin"
//       width="14"
//       height="14"
//       viewBox="0 0 24 24"
//       fill="none"
//     >
//       <circle
//         className="opacity-25"
//         cx="12"
//         cy="12"
//         r="10"
//         stroke="currentColor"
//         strokeWidth="4"
//       />
//       <path
//         className="opacity-75"
//         fill="currentColor"
//         d="M4 12a8 8 0 018-8v8H4z"
//       />
//     </svg>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (isRegister) {
        const res = await authAPI.register(data);
        login(res.data.user, res.data.token);
        toast.success(`Welcome, ${res.data.user.name}!`);
      } else {
        const res = await authAPI.login(data);
        login(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.name}!`);
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (isRegister ? "Registration failed" : "Invalid credentials"),
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister((v) => !v);
    reset();
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative w-full max-w-sm animate-fade-in">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent-blue/20 rounded-full blur-3xl pointer-events-none" />

        <div className="card p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-accent-blue mx-auto flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-white">FinanceOS</h1>
            <p className="text-gray-500 text-sm">
              {isRegister ? "Create your account" : "Sign in to your dashboard"}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-bg-secondary rounded-xl p-1 border border-bg-border">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                reset();
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${!isRegister ? "bg-accent-blue text-white" : "text-gray-400 hover:text-white"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                reset();
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isRegister ? "bg-accent-blue text-white" : "text-gray-400 hover:text-white"}`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isRegister && (
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="input-field"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Min 2 characters" },
                  })}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input-field"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {isRegister && (
              <div>
                <label className="label">Role</label>
                <select
                  className="input-field"
                  {...register("role")}
                  defaultValue="viewer"
                >
                  <option value="viewer">Viewer — can view records</option>
                  <option value="analyst">Analyst — can view + analyze</option>
                  <option value="admin">Admin — full access</option>
                </select>
                <p className="text-gray-600 text-xs mt-1">
                  In production, role is assigned by admin only.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-blue hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />{" "}
                  {isRegister ? "Creating account..." : "Signing in..."}
                </span>
              ) : isRegister ? (
                "Create Account"
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo credentials — login only */}
          {!isRegister && (
            <div className="border border-bg-border rounded-xl p-3 space-y-1.5">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Demo accounts
              </p>
              <DemoRow role="Admin" email="admin@demo.com" />
              <DemoRow role="Analyst" email="analyst@demo.com" />
              <DemoRow role="Viewer" email="viewer@demo.com" />
            </div>
          )}

          <p className="text-center text-gray-500 text-sm">
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-accent-blue hover:text-indigo-400 font-medium transition-colors"
            >
              {isRegister ? "Sign in" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function DemoRow({ role, email }) {
  const colors = {
    Admin: "badge-purple",
    Analyst: "badge-blue",
    Viewer: "badge-amber",
  };
  return (
    <div className="flex items-center justify-between">
      <span className={colors[role]}>{role}</span>
      <span className="text-gray-500 text-xs font-mono">{email} / pass123</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}