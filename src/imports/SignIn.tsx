import svgPaths from "./svg-jstjbqcg5v";
import imgFavicon from "figma:asset/b2d691b03f466790687a493358e336e4f415edda.png";
import { imgPageTitle } from "./svg-1qsoy";

function Frame245() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center leading-[0] not-italic relative shrink-0 text-[#333333] text-center">
      <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center relative shrink-0 text-[40px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Welcome to Peach</p>
      </div>
      <div className="flex flex-col font-['Poppins:Light',_sans-serif] justify-center relative shrink-0 text-[18px] w-[512px]">
        <p className="leading-[normal]">Peach gives you complete control over AI and automation to deliver top-quality service you can trust.</p>
      </div>
    </div>
  );
}

function SocialMediaLogo() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Social media logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Social media logo">
          <path d={svgPaths.p34387940} fill="var(--fill-0, #4285F4)" id="vector" />
          <path d={svgPaths.p1850cf00} fill="var(--fill-0, #34A853)" id="vector_2" />
          <path d={svgPaths.pc64bb40} fill="var(--fill-0, #FBBC05)" id="vector_3" />
          <path d={svgPaths.p36928240} fill="var(--fill-0, #EB4335)" id="vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center justify-center left-[calc(50%+0.5px)] top-[calc(50%-0.5px)] translate-x-[-50%] translate-y-[-50%]">
      <SocialMediaLogo />
      <div className="flex flex-col font-['Avenir:Roman',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#333333] text-[24px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Continue with Google</p>
      </div>
    </div>
  );
}

function SocialMediaSignupLogin() {
  return (
    <div className="bg-white h-[72px] relative rounded-[10px] shrink-0 w-[400px]" data-name="Social media signup/login">
      <div className="h-[72px] overflow-clip relative rounded-[inherit] w-[400px]">
        <Frame7 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute inset-[8.33%]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g id="Icon">
          <path d={svgPaths.p3cbd6d00} fill="var(--fill-0, #F25022)" id="Vector" />
          <path d={svgPaths.p26d59e00} fill="var(--fill-0, #00A4EF)" id="Vector_2" />
          <path d={svgPaths.p1b037300} fill="var(--fill-0, #7FBA00)" id="Vector_3" />
          <path d={svgPaths.p3a4e9400} fill="var(--fill-0, #FFB900)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function MicrosoftIcon() {
  return (
    <div className="absolute left-1/2 overflow-clip size-[32px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="microsoft-icon">
      <Icon />
    </div>
  );
}

function MaskedIcon() {
  return (
    <div className="absolute left-1/2 size-[32px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Masked Icon">
      <MicrosoftIcon />
    </div>
  );
}

function SocialMediaLogo1() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Social media logo">
      <MaskedIcon />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex gap-[16px] items-center justify-center left-[calc(50%+0.5px)] top-[calc(50%-0.5px)] translate-x-[-50%] translate-y-[-50%]">
      <SocialMediaLogo1 />
      <div className="flex flex-col font-['Avenir:Roman',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#333333] text-[24px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Continue with Office 365</p>
      </div>
    </div>
  );
}

function SocialMediaSignupLogin1() {
  return (
    <div className="bg-white h-[72px] relative rounded-[10px] shrink-0 w-[400px]" data-name="Social media signup/login">
      <div className="h-[72px] overflow-clip relative rounded-[inherit] w-[400px]">
        <Frame8 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#333333] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame246() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0">
      <SocialMediaSignupLogin />
      <SocialMediaSignupLogin1 />
    </div>
  );
}

function Content() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] items-center justify-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Content">
      <Frame245 />
      <Frame246 />
    </div>
  );
}

function Back() {
  return (
    <div className="absolute inset-[68.35%_98.06%_16.46%_0.97%]" data-name="back">
      <div className="absolute bottom-[-8.33%] left-[-7.14%] right-0 top-[-8.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14">
          <g id="back">
            <line id="Line 1" stroke="var(--stroke-0, #BABCBE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="2" x2="14" y1="7" y2="7" />
            <path d="M8 1L1 7L8 13" id="Vector 1" stroke="var(--stroke-0, #BABCBE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Forward() {
  return (
    <div className="relative size-full" data-name="forward">
      <div className="absolute bottom-[-8.33%] left-[-7.14%] right-0 top-[-8.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14">
          <g id="forward">
            <line id="Line 1" stroke="var(--stroke-0, #BABCBE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="2" x2="14" y1="7" y2="7" />
            <path d="M8 1L1 7L8 13" id="Vector 1" stroke="var(--stroke-0, #BABCBE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Refresh() {
  return (
    <div className="absolute inset-[65.82%_93.37%_16.46%_5.49%]" data-name="refresh">
      <div className="absolute bottom-[-7.14%] left-[-6.06%] right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 15">
          <g id="refresh">
            <path d={svgPaths.p268a2c80} fill="var(--fill-0, #C4C4C4)" id="Polygon 1" />
            <path d={svgPaths.p9805380} id="Ellipse 1" stroke="var(--stroke-0, #C4C4C4)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Lock() {
  return (
    <div className="absolute inset-[68.37%_90.97%_17.72%_8.47%]" data-name="lock">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 11">
        <g id="lock">
          <path d={svgPaths.p21156280} fill="var(--fill-0, #626365)" id="Union" />
          <rect fill="var(--fill-0, #626365)" height="7" id="Rectangle 5" rx="1" width="8" y="3.99097" />
        </g>
      </svg>
    </div>
  );
}

function Menu() {
  return (
    <div className="absolute inset-[68.35%_-18.75%_15.19%_118.54%]" data-name="menu">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 13">
        <g id="menu">
          <circle cx="1.5" cy="1.5" fill="var(--fill-0, #5F6369)" id="Ellipse 22" r="1.5" />
          <circle cx="1.5" cy="6.5" fill="var(--fill-0, #5F6369)" id="Ellipse 23" r="1.5" />
          <circle cx="1.5" cy="11.5" fill="var(--fill-0, #5F6369)" id="Ellipse 24" r="1.5" />
        </g>
      </svg>
    </div>
  );
}

function PageTitleWrapper1() {
  return (
    <div className="absolute contents inset-[26.47%_58.02%_26.47%_9.14%]" data-name="pageTitleWrapper">
      <p className="absolute font-['SF_Pro:Regular',_sans-serif] font-normal inset-[29.41%_51.71%_29.41%_9.78%] leading-[normal] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3.439px_-1px] mask-size-[176px_16px] text-[#202124] text-[12px] tracking-[0.18px]" style={{ fontVariationSettings: "'wdth' 100", maskImage: `url('${imgPageTitle}')` }}>
        Peach - AI Agent for Financial A
      </p>
    </div>
  );
}

function Favicon() {
  return (
    <div className="absolute inset-[26.47%_91.98%_26.47%_5.04%] rounded-[2px]" data-name="favicon">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none rounded-[2px] size-full" src={imgFavicon} />
    </div>
  );
}

function Group9() {
  return (
    <div className="relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="Group 8">
          <line id="Line 1" stroke="var(--stroke-0, #3C4043)" strokeLinejoin="round" x1="5.50001" x2="5.50001" y1="2.43666e-06" y2="11" />
          <line id="Line 2" stroke="var(--stroke-0, #3C4043)" strokeLinejoin="round" x1="1.35807e-05" x2="11" y1="5.5" y2="5.5" />
        </g>
      </svg>
    </div>
  );
}

function CloseTab1() {
  return (
    <div className="absolute contents inset-[26.47%_54%_27.77%_43.1%]" data-name="closeTab">
      <div className="absolute flex inset-[26.47%_54%_27.77%_43.1%] items-center justify-center">
        <div className="flex-none rotate-[45deg] size-[11px]">
          <Group9 />
        </div>
      </div>
    </div>
  );
}

function Tab1() {
  return (
    <div className="absolute bottom-0 contents left-[1.68%] right-[51.31%] top-0" data-name="tab">
      <div className="absolute bottom-0 left-[1.68%] right-[51.31%] top-0" data-name="Union">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 252 34">
          <path d={svgPaths.p4fa1300} fill="var(--fill-0, white)" id="Union" />
        </svg>
      </div>
      <PageTitleWrapper1 />
      <div className="absolute inset-[20.59%_58.02%_20.59%_36.38%]" data-name="fadeTitle" />
      <Favicon />
      <CloseTab1 />
    </div>
  );
}

function NewTab() {
  return (
    <div className="absolute inset-[29.41%_47.02%_29.41%_50.37%]" data-name="newTab">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="newTab">
          <line id="Line 1" stroke="var(--stroke-0, #3C4043)" strokeLinejoin="round" strokeWidth="2" x1="7" x2="7" y1="4.37114e-08" y2="14" />
          <line id="Line 2" stroke="var(--stroke-0, #3C4043)" strokeLinejoin="round" strokeWidth="2" x2="14" y1="7" y2="7" />
        </g>
      </svg>
    </div>
  );
}

function Frame31297() {
  return (
    <div className="absolute h-[34px] left-[71px] top-[8px] w-[536px]">
      <Tab1 />
      <NewTab />
    </div>
  );
}

function StopLights() {
  return (
    <div className="absolute inset-[18.99%_95.56%_65.82%_0.83%]" data-name="stopLights">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 12">
        <g id="stopLights">
          <circle cx="46" cy="6" fill="var(--fill-0, #00D641)" id="zoom" r="5.5" stroke="var(--stroke-0, #12B829)" />
          <circle cx="26" cy="6" fill="var(--fill-0, #FFBD00)" id="minimize" r="5.5" stroke="var(--stroke-0, #E79F13)" />
          <circle cx="6" cy="6" fill="var(--fill-0, #FF3B47)" id="close" r="5.5" stroke="var(--stroke-0, #EF1320)" />
        </g>
      </svg>
    </div>
  );
}

function ChromeTopLight() {
  return (
    <div className="absolute h-[79px] left-0 top-0 w-[1440px]" data-name="chromeTop / light">
      <div className="absolute bg-white bottom-[1.27%] left-0 right-[-20%] top-[53.16%]" data-name="toolbarBackground" />
      <div className="absolute bg-[#dfe1e4] bottom-0 left-0 right-[-20%] top-[98.73%]" data-name="bottomBorder" />
      <Back />
      <div className="absolute flex inset-[68.35%_95.83%_16.46%_3.19%] items-center justify-center">
        <div className="flex-none h-[12px] rotate-[180deg] w-[14px]">
          <Forward />
        </div>
      </div>
      <Refresh />
      <div className="absolute bottom-[6.33%] left-[7.5%] right-0 top-[58.23%]" data-name="addressArea">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1332 28">
          <path d={svgPaths.p399d6170} fill="var(--fill-0, #F1F3F4)" id="addressArea" />
        </svg>
      </div>
      <p className="absolute font-['SF_Pro:Regular',_sans-serif] font-normal inset-[65.82%_80.29%_12.66%_11.31%] leading-[normal] text-[#202124] text-[14px] text-nowrap tracking-[0.21px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        joinpeach.co/auth
      </p>
      <Lock />
      <Menu />
      <div className="absolute bg-[#dee1e7] bottom-[46.84%] left-0 right-0 rounded-tl-[5px] rounded-tr-[5px] top-0" data-name="tabBackground">
        <div className="absolute inset-0 pointer-events-none shadow-[0px_1px_0px_0px_inset_#f2f3f5]" />
      </div>
      <Frame31297 />
      <StopLights />
    </div>
  );
}

export default function SignIn() {
  return (
    <div className="bg-white overflow-clip relative rounded-tl-[5px] rounded-tr-[5px] size-full" data-name="Sign In">
      <ChromeTopLight />
      <Content />
      <div className="absolute flex flex-col font-['Poppins:Light',_sans-serif] justify-center leading-[0] left-[calc(50%+0.5px)] not-italic text-[#202124] text-[13px] text-center text-nowrap top-[calc(50%+216px)] translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal] whitespace-pre">By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
}