import { logout } from "../features/auth/authSlice";

export function setupResponseInterceptor(
    axiosInstance,
    store
) {
    const interceptorId =
        axiosInstance.interceptors.response.use(
            (response) => response,

            (error) => {
                const status = error.response?.status;
                const requestUrl = error.config?.url || "";

                /*
                 * Login endpoint can legitimately return 401
                 * for incorrect credentials.
                 *
                 * Do not globally logout/redirect in that case.
                 * LoginPage should display the authentication error.
                 */
                const isLoginRequest =
                    requestUrl.includes("/auth/login");

                if (status === 401 && !isLoginRequest) {
                    store.dispatch(logout());

                    /*
                     * Avoid unnecessary repeated redirects.
                     */
                    if (
                        window.location.pathname !== "/login"
                    ) {
                        window.location.replace("/login");
                    }
                }

                return Promise.reject(error);
            }
        );

    return interceptorId;
}