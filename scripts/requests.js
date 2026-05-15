// FYP Portal — Requests & Grievances Manager (client-side demo)
(function(){
  const REE_KEY = 'fyp_reevals';
  const GRV_KEY = 'fyp_grievances';

  const Requests = {
    _load(key){ try { return JSON.parse(localStorage.getItem(key))||[] } catch { return [] } },
    _save(key, v){ localStorage.setItem(key, JSON.stringify(v)); },

    submitProposalReeval(groupId, studentId, reason){
      if(!reason || reason.length < 10) return { error:'Please provide a reason (min 10 chars).' };
      const all = this._load(REE_KEY);
      const req = { id:'r_'+Date.now(), type:'proposal', groupId, studentId, reason, status:'submitted', timestamp:new Date().toISOString() };
      all.unshift(req); this._save(REE_KEY, all);
      // notify coordinator
      const coord = (window.FYP_USERS||[]).find(u=>u.role && u.role.toLowerCase().includes('fyp office')) || null;
      if(window.Notifications) Notifications.add({ title:'Re-evaluation Request', message:`Re-evaluation requested by ${studentId||'a student'} for proposal ${groupId}.`, recipientId: coord ? coord.id : null });
      return { ok:true, req };
    },

    submitMarksReeval(evaluationId, studentId, reason){
      if(!reason || reason.length < 10) return { error:'Please provide a reason (min 10 chars).' };
      const all = this._load(REE_KEY);
      const req = { id:'r_'+Date.now(), type:'marks', evaluationId, studentId, reason, status:'submitted', timestamp:new Date().toISOString() };
      all.unshift(req); this._save(REE_KEY, all);
      const coord = (window.FYP_USERS||[]).find(u=>u.role && u.role.toLowerCase().includes('fyp office')) || null;
      if(window.Notifications) Notifications.add({ title:'Marks Re-evaluation', message:`Marks re-eval requested by ${studentId||'a student'}.`, recipientId: coord ? coord.id : null });
      return { ok:true, req };
    },

    submitGrievance(studentId, category, description){
      if(!description || description.length < 50) return { error:'Description must be at least 50 characters.' };
      const all = this._load(GRV_KEY);
      const g = { id:'g_'+Date.now(), studentId, category, description, status:'submitted', timestamp:new Date().toISOString() };
      all.unshift(g); this._save(GRV_KEY, all);
      const coord = (window.FYP_USERS||[]).find(u=>u.role && u.role.toLowerCase().includes('fyp office')) || null;
      if(window.Notifications) Notifications.add({ title:'New Grievance', message:`A new grievance was submitted by ${studentId||'a student'}.`, recipientId: coord ? coord.id : null });
      return { ok:true, g };
    },

    getReevals(){ return this._load(REE_KEY); },
    getGrievances(){ return this._load(GRV_KEY); }
  };

  window.Requests = Requests;
})();
