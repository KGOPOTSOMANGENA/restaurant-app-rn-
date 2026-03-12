# 🍽️ Mce's Food & BEV — Restaurant App

A full-stack mobile restaurant app built with **React Native + Expo** and **Firebase**. Supports guest browsing, user ordering, and a full admin dashboard.

---

## 📱 Screenshots

> App runs on Android via Expo Go or a development build.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KGOPOTSOMANGENA/restaurant-app-rn-.git
cd restaurant-app-rn-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the App

```bash
# Standard start
npx expo start

# If your phone and PC are on different networks (tunnel mode)
npx expo start --tunnel
```

> Scan the QR code with the **Expo Go** app on your Android device.

---

## 🔐 Admin Login

| Field    | Value                        |
|----------|------------------------------|
| Email    | kgopotsomangena42@gmail.com  |
| Password | 123@Admin                    |

---

## 🏗️ Folder Structure

```
assets/                         # Images and static files
  categories/                   # Category and kids playground images
src/
  components/
    CategoryItem.tsx            # Horizontal category chip
    ChefCard.tsx                # Chef profile card
    FoodCard.tsx                # Food item card
  hooks/
    useAdminGuard.ts            # Redirects non-admins away from admin screens
  navigation/
    AdminNavigator.tsx          # Drawer navigator for admin
    AdminStack.tsx              # Admin screen stack
    AppStack.tsx                # Logged-in user screen stack
    AuthStack.tsx               # Login / Register stack
    LandingStack.tsx            # Public landing + menu stack
    RootNavigator.tsx           # Root — switches between stacks based on auth
  screens/
    Admin/
      AdminAnalytics.tsx        # Sales stats and top selling items
      AdminCategories.tsx       # Add / delete menu categories
      AdminHomeScreen.tsx       # Admin dashboard with logout
      AdminMenuForm.tsx         # Add / edit menu items with extras
      AdminMenuList.tsx         # List all menu items
      AdminOrders.tsx           # View all customer orders
      AdminRoot.tsx             # Admin entry point
    Auth/
      LoginScreen.tsx           # User login
      RegisterScreen.tsx        # User registration
    Cart/
      AddToCartScreen.tsx       # Item detail + extras + add to cart
      CartScreen.tsx            # Cart summary with checkout
    Checkout/
      CheckoutScreen.tsx        # Payment form + order placement
    ChefDetails/
      ChefDetailsScreen.tsx     # Individual chef profile
    FoodDetails/
      FoodDetailsScreen.tsx     # Food item detail (landing page flow)
    Home/
      HomeScreen.tsx            # Logged-in user home with search
    LandingPage/
      LandingPage.tsx           # Public landing page
    Menu/
      MenuScreen.tsx            # Public menu with search + filter
    Profile/
      OrderHistoryScreen.tsx    # User's past orders
      ProfileScreen.tsx         # Edit profile details
    Public/
      PublicMenuScreen.tsx      # Guest-accessible menu
  services/
    firebase.ts                 # Firebase config (auth, firestore, storage)
  store/
    CartContext.tsx             # Global cart state (React Context)
    authStore.ts               # Auth state (Zustand)
  types/                        # TypeScript type definitions
App.tsx                         # App entry point
app.json                        # Expo config
index.ts                        # Registers root component
babel.config.js                 # Babel config
```

---

## ✨ Features

### 👤 Guest / Public
- Browse the full menu without logging in
- View food item details, chefs, and categories
- Search food items from the landing page
- View kids playground section and opening hours
- View restaurant location (Google Maps link)

### 🔑 Registered User
- Register and login with email & password
- Add items to cart with extras
- Proceed to checkout with mock card payment
- View order history
- Edit profile (name, address, phone)

### 🛠️ Admin
- Manage menu items (add, edit, delete)
- Manage categories
- View all customer orders
- View analytics (revenue, top items, order count)
- Logout back to landing page

---

## 🔥 Firebase Setup

The app uses the following Firebase services:

| Service     | Usage                              |
|-------------|------------------------------------|
| Auth        | Email/password authentication      |
| Firestore   | Menu items, orders, users, categories |
| Storage     | local storage |

### Firestore Collections

| Collection  | Description                        |
|-------------|------------------------------------|
| `menuItems` | Food items with name, price, image, extras |
| `categories`| Menu categories                    |
| `orders`    | Customer orders                    |
| `users`     | User profiles                      |

> ⚠️ A Firestore **composite index** is required for order history queries:
> `orders` → `uid` (ASC) + `createdAt` (DESC)
> Firebase will provide the link to create it on first query.

---

## 📦 Key Dependencies

| Package                        | Purpose                        |
|-------------------------------|--------------------------------|
| `expo` ~54                    | App framework                  |
| `firebase` ^12                | Backend (auth + database)      |
| `react-navigation`            | Screen navigation              |
| `react-native-paper`          | UI component library           |
| `zustand`                     | Auth global state              |
| `expo-image-picker`           | Pick images from gallery       |
| `expo-image-manipulator`      | Compress images before upload  |
| `react-native-reanimated`     | Animations                     |

---

## 🌐 Running on a Different Network

If your phone and PC are not on the same Wi-Fi:

```bash
npx expo start --tunnel
```

This routes traffic through Expo's tunnel servers so your phone can connect over mobile data.

---

## 🖼️ Image Handling

To avoid Firebase Storage costs, images are:
1. Picked from the device gallery via `expo-image-picker`
2. Compressed to 400px wide, 50% quality using `expo-image-manipulator`
3. Stored as **base64 strings** directly in Firestore (stays under 1MB limit)

---

## 🔒 POPIA Compliance

This app complies with the **Protection of Personal Information Act (POPIA)**. User data is only collected for service purposes and is never sold or shared with third parties.

---

## 👨‍💻 Developer

**Kgopotso Mangena**
GitHub: [@KGOPOTSOMANGENA](https://github.com/KGOPOTSOMANGENA)
