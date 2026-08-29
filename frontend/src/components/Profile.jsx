import { useEffect, useState } from 'react';
import {
  MapPin, Eye, EyeOff, ShieldCheck,
  Link2, Phone, Mail, Lock
} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/AuthService';
function FieldRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start py-2">
      <Icon size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-emerald-700" />
      <div className="text-left px-2">
        <div
          className="text-[10px] tracking-[0.14em] uppercase text-slate-500"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {label}
        </div>

        <div className="text-[15px] mt-0.5 truncate text-slate-900">
          {value}
        </div>
      </div>
    </div>
  );
}
function PasswordField({ label, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className="text-[10px] text-left tracking-[0.14em] uppercase text-slate-500 mb-1.5"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      > {label}

      </div>
      <div className="relative">
        <input type={visible ? "text" : "password"} placeholder={placeholder} className="w-full bg-white border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 text-[14px] text-slate-900 outline-none focus:border-emerald-600 placeholder:text-slate-400" />
        <button type="button" tabIndex={-1} onClick={() => setVisible((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        > {visible ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}

        </button>
      </div>
    </div>
  );

}
function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        console.error("failed to load profile", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  return (
    <div className="min-h-screen  px-4 w-full flex items-start justify-center px-4 py-10 sm:py-16 bg-slate-100">
      <div className="w-full bg-pink 500  max-w-3xl relative">
        <div className="rounded-2xl  overflow-hidden bg-white border border-slate-200">
          <div className="px-6  h-[200px] bg-emerald-50 sm:px-10 pt-10 pb-8 border-b border-slate-200">
          </div>
          <div className=""></div>
          <div className="flex mt-[-50px]  justify-center flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative w-24 h-24 shrink-0 mx-auto sm:mx-0">
              <div className="w-full h-full shadow-2xl rounded-full overflow-hidden flex items-center justify-center text-3xl bg-emerald-50 text-emerald-700"
              >  AB                           </div>
            </div>

          </div>
          <div className="flex-1  text-center sm:text-center">
            <h2 className="leading-tight mt-3 text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 ">Associate Software Engineer</p>
            <div className="flex justify-center items-center  gap-1.5 mt-2 text-[13px] text-slate-500">
              <MapPin size={13} />
              <span>Lahore, Pakistan</span>
            </div>
          </div>

          {/* about */}
          <div className="px-6 py-6 w-full text-left border border-b border-slate-200">
            <div className="text-[10px] tracking-[0.14em] uppercase mb-3 text-slate-500">
              About
            </div>
            <p className="text-[15px] leading-relaxed text-slate-900">
              Full-stack engineer working across Laravel and Vue, with a growing focus on
              Node and React for MERN-based products.
            </p>
          </div>

          {/* contact */}

          {/* Contact */}
          <div className='py-3 px-4'>
            <div
              className="text-[10px] text-left tracking-[0.14em] uppercase mb-1 text-slate-500"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Contact
            </div>

            <div className="divide-y divide-slate-200">
              <FieldRow
                icon={Mail}
                label="Email"
                value={user?.email}
              />

              <FieldRow
                icon={Phone}
                label="Phone"
                value="+92 300 1234567"
              />

              <FieldRow
                icon={Link2}
                label="Portfolio"
                value="alexmorgan.dev"
              />
            </div>
          </div>
          {/* change password */}
          <div className="px-6 sm:px-10 py-8 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-[10px] tracking-[0.14em] uppercase text-slate-500"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  Security
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Lock size={15} className="text-slate-700" strokeWidth={1.75} />
                  <span className="text-[14px] text-slate-900">Password</span>
                </div>
              </div>
              {!changingPassword && (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="text-[13px] font-medium text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full"
                >
                  Change password
                </button>
              )}

            </div>
            {changingPassword && (
              <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <PasswordField label="Current Password" placeholder="Enter Current password" />
                <PasswordField label="New Password" placeholder="Enter New Password" />
                <PasswordField label="Confirm New Password" placeholder="Re-enter New Password" />
                <div className="flex items-start gap-2 text-[12px] text-slate-500 pt-1">
                  <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>
                    For security, we never store or display your previous password —
                    only you know it, even after it's changed.
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button className="text-[13px] font-medium text-white bg-emerald-700 px-4 py-2 rounded-full">
                    Update password
                  </button>
                  <button onClick={() => setChangingPassword(false)} className="text-[13px] font-medium text-slate-500 px-4 py-2 rounded-full hover:bg-slate-100"
                  >Cancel </button>
                </div>
              </div>

            )}
          </div>
        </div>
      </div>

    </div>

  );
}
export default Profile;