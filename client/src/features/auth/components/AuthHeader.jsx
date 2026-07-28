import logo from '../../../assets/logo.png'

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <img src={logo} alt="Assura Logo" loading='eager' className="h-24 w-auto object-contain" />

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-text-primary">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-sm text-text-secondary">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default AuthHeader

