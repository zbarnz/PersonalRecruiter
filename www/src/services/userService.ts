import { store } from "../store";
import UserAPI from "../../lib/api/classes/userAPI";
import { setUser, setLoading, setError, setLoggedIn } from "../store/slices/userSlice";

class UserService {
  private api: UserAPI;

  constructor() {
    this.api = new UserAPI();
  }

  async register(payload: { email: string; phone?: string; password: string }) {
    store.dispatch(setLoading(true));
    const res = await this.api.register(payload);
    if (res) {
      store.dispatch(setUser(res.user));
      store.dispatch(setLoggedIn(true));
      store.dispatch(setError(null));
    } else {
      store.dispatch(setError("Failed to register"));
    }
    store.dispatch(setLoading(false));
  }

  async login(payload: { email: string; password: string }) {
    store.dispatch(setLoading(true));
    const res = await this.api.login(payload);
    if (res) {
      store.dispatch(setUser(res.user));
      store.dispatch(setLoggedIn(true));
      store.dispatch(setError(null));
    } else {
      store.dispatch(setError("Failed to login"));
    }
    store.dispatch(setLoading(false));
  }

  async refresh() {
    store.dispatch(setLoading(true));
    const res = await this.api.refresh();
    if (res) {
      store.dispatch(setUser(res.user));
      store.dispatch(setLoggedIn(true));
      store.dispatch(setError(null));
    } else {
      store.dispatch(setError("Failed to refresh user"));
    }
    store.dispatch(setLoading(false));
  }
}

export default new UserService();
