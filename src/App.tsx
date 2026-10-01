import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { RootLayout } from '@/components/layout/RootLayout'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { HomePage } from '@/pages/public/HomePage'
import { AboutPage } from '@/pages/public/AboutPage'
import { ProductsPage } from '@/pages/public/ProductsPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { DynamicCmsPage } from '@/pages/public/DynamicCmsPage'

// Admin Components & Pages
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { ManagePagesPage } from '@/pages/admin/ManagePagesPage'
import { PageBuilderStudioPage } from '@/pages/admin/PageBuilderStudioPage'
import { ProductsPageEditorPage } from '@/pages/admin/ProductsPageEditorPage'
import { HomePageEditorPage } from '@/pages/admin/HomePageEditorPage'
import { AboutPageEditorPage } from '@/pages/admin/AboutPageEditorPage'
import { InquiriesPage } from '@/pages/admin/InquiriesPage'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website Core Routes */}
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Dynamic CMS Page Route */}
            <Route path="/:slug" element={<DynamicCmsPage />} />
          </Route>

          {/* Admin Public Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/pages" element={<ManagePagesPage />} />
              <Route path="/admin/pages/builder/:pageId" element={<PageBuilderStudioPage />} />
              <Route path="/admin/pages/home/edit" element={<HomePageEditorPage />} />
              <Route path="/admin/pages/about/edit" element={<AboutPageEditorPage />} />
              <Route path="/admin/pages/products/edit" element={<ProductsPageEditorPage />} />
              <Route path="/admin/inquiries" element={<InquiriesPage />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
