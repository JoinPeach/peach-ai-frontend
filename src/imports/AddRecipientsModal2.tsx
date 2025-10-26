import svgPaths from "./svg-ilqcsir8pv";

function Left() {
  return (
    <div className="h-[58px] leading-[0] relative shrink-0 text-nowrap w-[310px]" data-name="left">
      <div className="absolute font-['SF_Pro:Medium',_sans-serif] font-[510] left-0 text-[#0b0b0b] text-[24px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">Recipients</p>
      </div>
      <div className="absolute font-['SF_Pro:Regular',_sans-serif] font-normal left-0 overflow-ellipsis overflow-hidden text-[#6d6d6d] text-[16px] top-[38px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] overflow-ellipsis overflow-hidden text-nowrap whitespace-pre">The students who receive your campaign</p>
      </div>
    </div>
  );
}

function Wrapper() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="wrapper">
      <Left />
    </div>
  );
}

function MasterGeneral() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="master/ general">
      <Wrapper />
    </div>
  );
}

function TitleSectionTitle() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="title section: title">
      <MasterGeneral />
    </div>
  );
}

function Close() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="close">
          <path d={svgPaths.p28c1a880} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MasterOutlineButton() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="master/ outline button">
      <div aria-hidden="true" className="absolute border border-[#dddddd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['SF_Pro:Semibold',_sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[12px] text-black text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[18px] whitespace-pre">jlennon@university.edu</p>
      </div>
      <Close />
    </div>
  );
}

function ButtonRoundedOutline() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="button: rounded/ outline">
      <MasterOutlineButton />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <ButtonRoundedOutline />
    </div>
  );
}

function Close1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="close">
          <path d={svgPaths.p28c1a880} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MasterOutlineButton1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="master/ outline button">
      <div aria-hidden="true" className="absolute border border-[#dddddd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['SF_Pro:Semibold',_sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[12px] text-black text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[18px] whitespace-pre">bjones@university.edu</p>
      </div>
      <Close1 />
    </div>
  );
}

function ButtonRoundedOutline1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="button: rounded/ outline">
      <MasterOutlineButton1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <ButtonRoundedOutline1 />
    </div>
  );
}

function Frame1000004312() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Close2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="close">
          <path d={svgPaths.p28c1a880} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MasterOutlineButton2() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="master/ outline button">
      <div aria-hidden="true" className="absolute border border-[#dddddd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['SF_Pro:Semibold',_sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[12px] text-black text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[18px] whitespace-pre">jabdul3@university.edu</p>
      </div>
      <Close2 />
    </div>
  );
}

function ButtonRoundedOutline2() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="button: rounded/ outline">
      <MasterOutlineButton2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <ButtonRoundedOutline2 />
    </div>
  );
}

function Close3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="close">
          <path d={svgPaths.p28c1a880} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function MasterOutlineButton3() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="master/ outline button">
      <div aria-hidden="true" className="absolute border border-[#dddddd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['SF_Pro:Semibold',_sans-serif] font-[590] justify-center leading-[0] relative shrink-0 text-[12px] text-black text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[18px] whitespace-pre">mlamburg6@university.edu</p>
      </div>
      <Close3 />
    </div>
  );
}

function ButtonRoundedOutline3() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="button: rounded/ outline">
      <MasterOutlineButton3 />
    </div>
  );
}

function Frame1000004313() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <ButtonRoundedOutline3 />
    </div>
  );
}

function Frame1000004314() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <Frame5 />
      <Frame1000004313 />
    </div>
  );
}

function Frame1000004319() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <Frame1000004312 />
      {[...Array(3).keys()].map((_, i) => (
        <Frame1000004314 key={i} />
      ))}
    </div>
  );
}

function Frame1000004327() {
  return (
    <div className="content-stretch flex gap-[79px] items-start relative shrink-0">
      <Frame1000004319 />
      <div className="bg-[#d9d9d9] h-[80px] rounded-[50px] shrink-0 w-[4px]" />
    </div>
  );
}

function UploadDragUpload() {
  return (
    <div className="bg-white h-[199px] opacity-60 relative rounded-[8px] shrink-0 w-full" data-name="upload: drag upload">
      <div aria-hidden="true" className="absolute border border-[#e7e7e7] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] h-[199px] items-start p-[8px] relative w-full">
          <Frame1000004327 />
        </div>
      </div>
    </div>
  );
}

function Frame1000004310() {
  return (
    <div className="content-stretch flex gap-[246px] items-start justify-end leading-[0] relative shrink-0 text-[#0b0b0b] text-nowrap">
      <div className="font-['SF_Pro:Semibold',_sans-serif] font-[590] relative shrink-0 text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">30 recipients</p>
      </div>
      <div className="font-['SF_Pro:Regular',_sans-serif] font-normal relative shrink-0 text-[15px] text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">500 remaining emails</p>
      </div>
    </div>
  );
}

function DivCss15Nffxn() {
  return (
    <div className="relative shrink-0 w-full" data-name="div.css-15nffxn">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center pl-0 pr-[284px] py-0 relative w-full">
          <div className="bg-[#ffa88b] h-[8px] rounded-bl-[7992px] rounded-tl-[7992px] shrink-0 w-[30px]" data-name="div.css-wlt9ab" />
          <div className="bg-[#f2f1f4] h-[8px] rounded-br-[7992px] rounded-tr-[7992px] shrink-0 w-[472px]" data-name="div.css-1b0fq1t" />
        </div>
      </div>
    </div>
  );
}

function Frame1000004309() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame1000004310 />
      <DivCss15Nffxn />
    </div>
  );
}

function MasterOutlineButton8() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0" data-name="master/ outline button">
      <div aria-hidden="true" className="absolute border border-[#cecece] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#6d6d6d] text-[14px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">Cancel</p>
      </div>
    </div>
  );
}

function ButtonRoundedOutline8() {
  return (
    <button className="box-border content-stretch cursor-pointer flex items-start overflow-visible p-0 relative shrink-0" data-name="button: rounded/ outline">
      <MasterOutlineButton8 />
    </button>
  );
}

function MasterButton() {
  return (
    <div className="bg-[#2e2c34] box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0" data-name="master/ button">
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white">
        <p className="leading-[20px] whitespace-pre">Save</p>
      </div>
    </div>
  );
}

function ButtonRoundedFilled() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="button: rounded/ filled">
      <MasterButton />
    </div>
  );
}

function Buttons() {
  return (
    <div className="content-stretch flex gap-[16px] items-start justify-end relative shrink-0 w-full" data-name="buttons">
      <ButtonRoundedOutline8 />
      <ButtonRoundedFilled />
    </div>
  );
}

export default function AddRecipientsModal2() {
  return (
    <div className="bg-white relative rounded-[16px] shadow-[0px_4px_50px_0px_rgba(33,33,33,0.08),0px_4px_6px_0px_rgba(33,33,33,0.04)] size-full" data-name="add recipients modal 2">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
          <TitleSectionTitle />
          <UploadDragUpload />
          <Frame1000004309 />
          <Buttons />
        </div>
      </div>
    </div>
  );
}