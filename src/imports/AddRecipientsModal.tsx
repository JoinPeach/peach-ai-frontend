import svgPaths from "./svg-9wwfzsfyem";

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

function Upload() {
  return (
    <div className="relative shrink-0 size-[42px]" data-name="upload">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42 42">
        <g clipPath="url(#clip0_1_7301)" id="upload">
          <path d={svgPaths.p314c7100} fill="var(--fill-0, #CED9F9)" id="Vector" />
          <path d={svgPaths.p35280000} fill="var(--fill-0, #1640C1)" id="Vector_2" />
          <path d={svgPaths.p3df5b40} fill="var(--fill-0, #2354E6)" id="Vector_3" />
          <path d={svgPaths.p29f9a900} fill="var(--fill-0, #1849D6)" id="Vector_4" />
          <path d={svgPaths.pa5d1a00} fill="var(--fill-0, #E7ECFC)" id="Vector_5" />
          <path d={svgPaths.p1f5a2600} fill="var(--fill-0, #CED9F9)" id="Vector_6" />
          <path d={svgPaths.p51e4400} fill="var(--fill-0, #6C8DEF)" id="Vector_7" />
          <path d={svgPaths.p27eafc00} fill="var(--fill-0, #3B67E9)" id="Vector_8" />
        </g>
        <defs>
          <clipPath id="clip0_1_7301">
            <rect fill="white" height="42" width="42" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex gap-[4px] items-start justify-center relative shrink-0 w-full" data-name="text">
      <div className="basis-0 font-['SF_Pro:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#84818a] text-[14px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px]">Drag your file(s) to start uploading (e.g. include full name and email)</p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-[201px]" data-name="Divider">
      <div className="basis-0 bg-[#e7e7e7] grow h-[0.971px] min-h-px min-w-px shrink-0" data-name="line 1" />
      <div className="font-['Montserrat:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#6d6d6d] text-[12px] text-center text-nowrap">
        <p className="leading-[18px] whitespace-pre">OR</p>
      </div>
      <div className="basis-0 bg-[#e7e7e7] grow h-[0.971px] min-h-px min-w-px shrink-0" data-name="line 2" />
    </div>
  );
}

function MasterOutlineButton() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[6px] relative rounded-[8px] shrink-0" data-name="master/ outline button">
      <div aria-hidden="true" className="absolute border border-[#1849d6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#1849d6] text-[12px] text-nowrap">
        <p className="leading-[18px] whitespace-pre">Browse files</p>
      </div>
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
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
      <Text />
      <Divider />
      <ButtonRoundedOutline />
    </div>
  );
}

function UploadDragUpload() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="upload: drag upload">
      <div aria-hidden="true" className="absolute border border-[#1849d6] border-dashed inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-center justify-center p-[24px] relative w-full">
          <Upload />
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame1000004311() {
  return (
    <div className="content-stretch flex gap-[256px] items-start leading-[0] relative shrink-0 text-[#0b0b0b] text-nowrap">
      <div className="font-['SF_Pro:Semibold',_sans-serif] font-[590] relative shrink-0 text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">0 recipients</p>
      </div>
      <div className="font-['SF_Pro:Regular',_sans-serif] font-normal relative shrink-0 text-[15px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[20px] text-nowrap whitespace-pre">500 remaining emails</p>
      </div>
    </div>
  );
}

function DivCss15Nffxn() {
  return (
    <div className="h-[8px] relative shrink-0 w-full" data-name="div.css-15nffxn">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex gap-[4px] h-[8px] items-center pl-0 pr-[284px] py-0 relative w-full">
          <div className="bg-[#e7e7e7] h-full rounded-[7992px] shrink-0 w-[502px]" data-name="div.css-1b0fq1t" />
        </div>
      </div>
    </div>
  );
}

function Frame1000004308() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-start relative shrink-0 w-full">
      <Frame1000004311 />
      <DivCss15Nffxn />
    </div>
  );
}

function MasterOutlineButton1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0" data-name="master/ outline button">
      <div aria-hidden="true" className="absolute border border-[#cecece] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#6d6d6d] text-[14px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">Cancel</p>
      </div>
    </div>
  );
}

function ButtonRoundedOutline1() {
  return (
    <button className="box-border content-stretch cursor-pointer flex items-start overflow-visible p-0 relative shrink-0" data-name="button: rounded/ outline">
      <MasterOutlineButton1 />
    </button>
  );
}

function MasterButton() {
  return (
    <div className="bg-[rgba(46,44,52,0.2)] box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative rounded-[8px] shrink-0" data-name="master/ button">
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.5)] text-nowrap">
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
      <ButtonRoundedOutline1 />
      <ButtonRoundedFilled />
    </div>
  );
}

export default function AddRecipientsModal() {
  return (
    <div className="bg-white relative rounded-[16px] shadow-[0px_4px_50px_0px_rgba(33,33,33,0.08),0px_4px_6px_0px_rgba(33,33,33,0.04)] size-full" data-name="add recipients modal">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
          <TitleSectionTitle />
          <UploadDragUpload />
          <Frame1000004308 />
          <Buttons />
        </div>
      </div>
    </div>
  );
}