// The decide block's two lines (ConfigView, SRSessionView): what was set up,
// and why. While the block's count is on its way it says `pending` and keeps
// the room of the counted lines it expects, drawn hidden in the same place, so
// nothing under the lines moves when the count lands. On 15 Nov the start row
// and ปรับเอง moved down or up as a cold bank arrived, and a tap made then
// reached no button.
export default function DecideLines({ id, pending = null, what, why = null }) {
  if (pending == null) {
    return (
      <>
        <p className="vmx-decide-what" id={id}>{what}</p>
        {why != null && <p className="vmx-decide-why">{why}</p>}
      </>
    );
  }
  return (
    <>
      <div className="vmx-decide-pending">
        <p className="vmx-decide-what" id={id}>{pending}</p>
        <p className="vmx-decide-what vmx-decide-ghost" aria-hidden="true">{what}</p>
      </div>
      {why != null && <p className="vmx-decide-why vmx-decide-ghost" aria-hidden="true">{why}</p>}
    </>
  );
}
