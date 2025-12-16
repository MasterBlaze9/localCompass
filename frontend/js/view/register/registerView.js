export function renderRegister(root) {
root.innerHTML = `
<div class="register-wrapper">
<div class="register-card">
<h2 class="register-title">Create account</h2>


<label class="register-label">Email</label>
<input
class="register-input"
type="email"
placeholder="Enter your email"
/>


<label class="register-label">Phone number</label>
<input
class="register-input"
type="tel"
placeholder="Enter your phone number"
/>


<label class="register-label">Password</label>
<input
class="register-input"
type="password"
placeholder="Create a password"
/>


<button class="register-btn">Sign up</button>


<div class="register-footer">
Already have an account?
<a id="toLogin">Sign in</a>
</div>
</div>
</div>
`;
}
