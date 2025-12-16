export function renderLogin(root) {
root.innerHTML = `
<div class="login-wrapper">
<div class="login-card">
<h2 class="login-title">Welcome back</h2>


<label class="login-label">Email or phone</label>
<input
class="login-input"
type="text"
placeholder="Email or phone number"
/>


<label class="login-label">Password</label>
<input
class="login-input"
type="password"
placeholder="Your password"
/>


<div class="login-row">
<label><input type="checkbox" /> Remember me</label>
<span class="login-link">Forgot password</span>
</div>


<button class="login-btn">Sign in</button>


<div class="login-footer">
Don’t have an account?
<a id="toRegister">Sign up</a>
</div>
</div>
</div>
`;
}